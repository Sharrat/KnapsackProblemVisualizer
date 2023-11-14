import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import './ButtonStyles.css';
import './InputStyles.css';
import './HeaderStyles.css';
import Papa from 'papaparse';
import './ResultsComponent.css';
import { Bar } from "react-chartjs-2";
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";
import KnapsackTable from "./KnapsackTable";
function KnapsackInput() {
    ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);
    const allAlgorithms = ["Dynamic Programming", "Greedy Algorithm", "Branch and Bound", "Genetic Algorithm", "Ant Colony Optimization Algorithm", "Brute Force Algorithm"];
    const [selectedAlgorithms, setSelectedAlgorithms] = useState([...allAlgorithms]);
    const handleCheckboxChange = (algorithm) => {
        if (selectedAlgorithms.includes(algorithm)) {
            setSelectedAlgorithms(selectedAlgorithms.filter(item => item !== algorithm));
        } else {
            setSelectedAlgorithms([...selectedAlgorithms, algorithm]);
        }
    };
    const [numItems, setNumItems] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [items, setItems] = useState([]);
    const [minRandom, setMinRandom] = useState(1);
    const [maxRandom, setMaxRandom] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [dpResults, setDpResults] = useState(null);
    const [graResults, setGraResults] = useState(null);
    const [bfResults, setBfResults] = useState(null);
    const [genaResults, setGenaResults] = useState(null);
    const [bnbResults, setBnbResults] = useState(null);
    const [acoResults, setAcoResults] = useState(null);
    const results = {
        "Dynamic Programming": dpResults,
        "Greedy Algorithm": graResults,
        "Branch and Bound": bnbResults,
        "Genetic Algorithm": genaResults,
        "Ant Colony Optimization Algorithm": acoResults,
        "Brute Force Algorithm": bfResults
    };
    const createChartData = (dataKey) => {
        return selectedAlgorithms.reduce((acc, algorithm) => {
            if (results[algorithm] && results[algorithm][dataKey] !== undefined) {
                acc.push(results[algorithm][dataKey]);
            } else {
                acc.push(null);
            }
            return acc;
        }, []);
    };
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [activeTableIndex, setActiveTableIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAppearing, setIsAppearing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const intervalId = useRef(null);
    const renderCircles = () => {
        return (
            <div style={{ textAlign: 'center', padding: '10px' }}>
                {selectedAlgorithms.map((_, index) => (
                    <span
                        key={index}
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: activeTableIndex === index ? 'yellow' : 'white',
                            borderRadius: '50%',
                            display: 'inline-block',
                            margin: '0 5px',
                        }}
                    />
                ))}
            </div>
        );
    };
    const resetInterval = () => {
        clearInterval(intervalId.current);
        intervalId.current = setInterval(handleNext, 7000);
    };
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleCSV(file);
        }
    };
    const handleNext = () => {
        setIsTransitioning(true);
        setIsAppearing(false); // Rozpoczęcie animacji wygaszania
        setTimeout(() => {
            setActiveTableIndex((prevIndex) => (prevIndex + 1) % selectedAlgorithms.length);
        }, 250);
        setTimeout(() => {
            setIsTransitioning(false);
            setIsAppearing(true); // Rozpoczęcie animacji pojawiania się
        }, 500);
        resetInterval();
    };
    const handlePrev = () => {
        setIsTransitioning(true);
        setIsAppearing(false); // Rozpoczęcie animacji wygaszania
        setTimeout(() => {
            setActiveTableIndex((prevIndex) => (prevIndex - 1 + selectedAlgorithms.length) % selectedAlgorithms.length);
        }, 250);
        setTimeout(() => {
            setIsTransitioning(false);
            setIsAppearing(true); // Rozpoczęcie animacji pojawiania się
        }, 500);
        resetInterval();
    };
    useEffect(() => {
        intervalId.current = setInterval(handleNext, 7000);

        return () => clearInterval(intervalId.current); // Czyszczenie interwału
    }, []);
    const option = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: 'black'  // Set color of legend labels
                }
            },
            title: {
                display: false,
                text: "",
                color: "black"
            },
        },
        scales: {
            x: {
                barPercentage: 0.2,
                grid: {
                    color: 'black'  // Set color of vertical grid lines
                },
                ticks: {
                    color: 'black', // Optionally, set color of x-axis labels
                    font: {
                        size: 9,
                    }
                }
            },
            y: {
                grid: {
                    color: 'black'  // Set color of horizontal grid lines
                },
                ticks: {
                    color: 'black'  // Optionally, set color of y-axis labels
                }
            }
        }
    };
    const data = {
        labels: selectedAlgorithms,
        datasets: [
            {
                label: 'Max Value',
                data: createChartData('maxValue'),
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data2 = {
        labels: selectedAlgorithms,
        datasets: [
            {
                label: 'Processing time',
                data: createChartData('exeTime'),
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data3 = {
        labels: selectedAlgorithms,
        datasets: [
            {
                label: 'Memory used',
                data: createChartData('memoryUsed'),
                backgroundColor:'lightyellow',
            },
        ],
    };
    function initializeItems() {
        const initialItems = Array.from({ length: Number(numItems) }, () => ({ weight: 0, value: 0 }));
        setItems(initialItems);
    }

    function toggleModal() {
        setIsModalOpen(!isModalOpen);
    }

    function toggleModal2() {
        setIsModalOpen2(!isModalOpen2);
    }
    function updateItem(index, key, value) {
        const updatedItems = [...items];
        updatedItems[index][key] = Number(value);
        setItems(updatedItems);
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function handleSubmit() {
        setDpResults(null);
        setBfResults(null);
        setBnbResults(null);
        setAcoResults(null);
        setGraResults(null);
        setGenaResults(null);
        setLoading(true);
        console.log('Items:', items);
        console.log('Capacity:', capacity);

        // Extracting weights and values from the items
        const weights = items.map(item => item.weight);
        console.log('Weights', weights);
        const values = items.map(item => item.value);
        console.log('values', values);

        // Prepare data for POST request
        const data = {
            values: values,
            weights: weights,
            capacity: capacity
        };
        const algorithms = [
            {name: "Dynamic Programming", endpoint: 'dp', setResult: setDpResults},
            {name: "Brute Force Algorithm", endpoint: 'bf', setResult: setBfResults},
            {name: "Greedy Algorithm", endpoint: 'gra', setResult: setGraResults},
            {name: "Genetic Algorithm", endpoint: 'gena', setResult: setGenaResults},
            {name: "Ant Colony Optimization Algorithm", endpoint: 'aco', setResult: setAcoResults},
            {name: "Branch and Bound", endpoint: 'bnb', setResult: setBnbResults}
        ];
        const timeout = 5 * 60 * 1000;
        const startTime = Date.now();
        await axios.post('http://localhost:8080/knapsack01/dp', data)
        await delay (5000)
        for (const algorithm of algorithms) {
            if (selectedAlgorithms.includes(algorithm.name)) {
                console.log(`${algorithm.name} is selected.`);

                try {
                    const response = await axios.post(`http://localhost:8080/knapsack01/${algorithm.endpoint}`, data);
                    console.log(`${algorithm.name} Results:`, response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    algorithm.setResult({
                        ...response.data,
                        selectedItems: reversedItems
                    });

                    if (Date.now() - startTime > timeout) {
                        throw new Error("Timeout reached");
                    }

                    await delay(5000); // 5-second delay
                } catch (error) {
                    console.error(`Error fetching ${algorithm.name} results`, error);
                    // Handle error
                    break; // Stop further processing
                }
            }
        }
        setLoading(false);
        setIsSubmitted(true);
        // Wyłącz przycisk
        setIsButtonDisabled(true);

        // Ponownie włącz przycisk po 400 ms
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 400);
    }
    function randomBetween(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + parseInt(min));
    }

    function randomizeWeights() {
        const randomizedItems = items.map(item => ({
            ...item,
            weight: randomBetween(minRandom, maxRandom)
        }));
        setItems(randomizedItems);
    }

    function randomizeValues() {
        const randomizedItems = items.map(item => ({
            ...item,
            value: randomBetween(minRandom, maxRandom)
        }));
        setItems(randomizedItems);
    }


    const handleCSV = (file) => {
        Papa.parse(file, {
            complete: (result) => {
                const data = result.data;

                // Ostatni wiersz jest pojemnością plecaka
                const capacityRow = data[data.length - 1];
                setCapacity(parseInt(capacityRow[0], 10));

                // Pozostałe wiersze to przedmioty
                const itemsData = data.slice(0, -1).map(row => ({
                    weight: parseInt(row[0], 10),
                    value: parseInt(row[1], 10)
                }));

                setNumItems(itemsData.length);
                setItems(itemsData);
            },
            header: false,
            skipEmptyLines: true
        });
    };

    return (
        <div style={{Height:'100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ background: '#333', color: '#fff', padding: '10px',height:'40px', textAlign: 'center' }}>
                <p className="site-title" style={{textAlign:"center"}}><b>Knapsack problem visualizer</b></p>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {
                    isModalOpen && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                width: '300px',
                                textAlign: 'center'
                            }}>
                                <h3>Select Randomization Range</h3>
                                <p> Min</p>
                                <input
                                    className="custom-input"
                                    type="number"
                                    value={minRandom}
                                    onChange={e => setMinRandom(e.target.value)}
                                    placeholder="Min value"
                                />
                                <br></br>
                                <p>Max</p>
                                <input
                                    className="custom-input"
                                    type="number"
                                    value={maxRandom}
                                    onChange={e => setMaxRandom(e.target.value)}
                                    placeholder="Max value"
                                />
                                <br></br>
                                <button onClick={toggleModal}>Confirm</button>
                            </div>
                        </div>

                    )

                }
                {
                    loading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                width: '300px',
                                textAlign: 'center'
                            }}>
                                <h3>Processing data...</h3>
                            </div>
                        </div>

                    )

                }
                {
                    isModalOpen2 && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                width: '300px',
                                textAlign: 'center'
                            }}>
                                <h3>Select Algorithms</h3>
                                <div style={{textAlign:'left'}}>
                                    {allAlgorithms.map((algorithm) => (
                                        <div key={algorithm}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAlgorithms.includes(algorithm)}
                                                    onChange={() => handleCheckboxChange(algorithm)}
                                                />
                                                {algorithm}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={toggleModal2}>Confirm</button>
                            </div>
                        </div>

                    )

                }
                <div style={{minHeight:'calc(100vh - 60px - 50px)',maxHeight:'calc(100vh - 120px - 50px)' ,overflowY: 'hidden', overflowX:'hidden', borderRight: '1px solid #000', boxSizing: 'border-box', backgroundColor:'grey', width: '50%', padding:'0px' }}>
                        <div style={{borderRadius: '0px',display: 'flex',flexGrow: 1, padding: '10px 0',marginTop:'50px', width:'100%', margin: '0px', border: '1px solid #000', textAlign:"center", backgroundColor: 'lightgrey'}}>
                            <div style={{float: 'left',width:'',margin:'auto'}}>
                                <label>
                                    <b>Number of Items</b>
                                    <br></br>
                                    <input className="custom-input" type="number" value={numItems} onChange={e => setNumItems(e.target.value)} />
                                </label>
                                <br></br>
                                <label>
                                    <b>Capacity</b>
                                    <br></br>
                                    <input className="custom-input" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
                                </label>
                                <br></br>
                                <button className="custom-button" onClick={initializeItems}>Set</button>
                            </div>
                            {items.length === 0 && (<div style={{textAlign:"left"}}><label style={{margin:'auto'}}><b>Load data from CSV</b></label><br></br>
                                    <input style={{margin:'auto'}} type="file" onChange={handleFileInput} /></div>)}
                                {items.length > 0 && (
                                    <>
                                    <div style={{margin:'auto'}}>
                                            <button className="custom-button" style={{width:'190px'}} onClick={handleSubmit} disabled={isButtonDisabled}>Solve</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={randomizeWeights}>Randomize Weights</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={randomizeValues}>Randomize Values</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={toggleModal}>Set Randomization Range</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={toggleModal2}>Select Algorithms</button>
                                        <div style={{textAlign:"center"}}><label style={{margin:'auto'}}><b>Load data from CSV</b></label><br></br>
                                            <input type="file" onChange={handleFileInput} style={{width:'90px'}} /></div>
                                    </div>
                                    </>
                                )}

                        </div>
                        <div style={{  overflowY: 'auto',
                            overflowX: 'hidden',
                            boxSizing: 'border-box',
                            padding: '0px',
                            maxHeight: 'calc(100vh - 50px - 250px)',
                            margin: '0px'}}>
                        {items.map((item, index) => (
                            <div key={index} style={{borderRadius: '52px',boxSizing:'border-box',margin: '10px auto', border: '2px solid #000', width: '50%', textAlign:"center", backgroundColor: 'lightgrey',paddingBottom:'10px'}}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'lightyellow',marginTop:'0px',height:'50px', borderRadius:'100px 100px 0 0'}}>
                                    <p style ={{fontSize:'18px',textAlign:'center', margin:'0'}}><b>Item {index + 1}</b></p>
                                </div>
                                <div>
                                    <label style ={{}}>Weight</label>
                                    <br></br>
                                    <input className="custom-input" style={{width:'30%',position:"relative"}} type="number" value={item.weight} onChange={e => updateItem(index, 'weight', e.target.value)} />
                                    <br></br>
                                    <label style ={{}}>Value</label>
                                    <br></br>
                                    <input className="custom-input" type="number" style={{width:'30%',position:"relative"}} value={item.value} onChange={e => updateItem(index, 'value', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        </div>

                    </div>

                <div style={{minHeight:'calc(100vh - 60px - 50px)',maxHeight:'calc(100vh - 120px - 50px)' ,overflowY: 'auto', overflowX:'hidden', borderRight: '1px solid #000', boxSizing: 'border-box', backgroundColor:'grey', width: '50%', padding:'0px'}}>
                    <h3>Results</h3>
                    {isSubmitted && (<div style={{display:'flex',flexDirection:'column'}}>
                        <div className="carousel-container" style={{ display: 'flex', backgroundColor: 'grey' }}>

                        <div id={'1'} style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', padding: '0px' }}>
                            {selectedAlgorithms.map((algorithm, index) => {
                                const resultsMapped = results[algorithm];
                                return resultsMapped && activeTableIndex === index && (
                                    <div key={algorithm} style={{display:'flex', margin:'auto'}}>
                                        <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                        <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                            <KnapsackTable title={algorithm} data={resultsMapped} />
                                        </div>
                                        <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                        {renderCircles()}
                    </div>)
                    }
                    {isSubmitted && (
                        <div>
                            <div style={{margin:'auto',padding:'auto', width:"auto"}}>
                                <br></br>
                                <label><b>Max value comparison chart</b></label>
                                <Bar options={option} data={data} style={{width:'90%',height:'auto',margin:'auto'}}/>
                            </div>
                            <div style={{margin:'auto',padding:'auto', width:"auto"}}>
                                <br></br>
                                <label><b>Processing time comparison chart</b></label>
                                <Bar options={option} data={data2} style={{width:'90%',height:'auto',margin:'auto'}}/>
                            </div>
                            <div style={{margin:'auto',padding:'auto', width:"auto"}}>
                                <label><b>Memory usage comparison chart</b></label>
                                <Bar options={option} data={data3} style={{width:'90%',height:'auto',margin:'auto'}}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#333', color: '#fff', height:'30px', padding: '10px', textAlign: 'right' }}>
                <p style={{textAlign:"right",display: 'inline'}}><i>Version 0.0.1 </i></p>
                <p style={{textAlign:"right",display: 'inline'}}><i>2023 © Adam Sołtysiak</i></p>
            </div>
        </div>
    );

}
export default KnapsackInput;