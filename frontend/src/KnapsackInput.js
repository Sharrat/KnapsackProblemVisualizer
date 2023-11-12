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
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [results, setResults] = useState(null);
    const [dpResults, setDpResults] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [activeTableIndex, setActiveTableIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAppearing, setIsAppearing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const intervalId = useRef(null);
    const renderCircles = () => {
        return (
            <div style={{ textAlign: 'center', padding: '10px' }}>
            <span
                key={0}
                style={{
                    height: '10px',
                    width: '10px',
                    backgroundColor: activeTableIndex === 0 ? 'yellow' : 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    margin: '0 5px',
                }}
            />
                <span
                    key={1}
                    style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: activeTableIndex === 1 ? 'yellow' : 'white',
                        borderRadius: '50%',
                        display: 'inline-block',
                        margin: '0 5px',
                    }}
                />
                <span
                    key={2}
                    style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: activeTableIndex === 2 ? 'yellow' : 'white',
                        borderRadius: '50%',
                        display: 'inline-block',
                        margin: '0 5px',
                    }}
                />
                <span
                    key={3}
                    style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: activeTableIndex === 3 ? 'yellow' : 'white',
                        borderRadius: '50%',
                        display: 'inline-block',
                        margin: '0 5px',
                    }}
                />
                <span
                    key={4}
                    style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: activeTableIndex === 4 ? 'yellow' : 'white',
                        borderRadius: '50%',
                        display: 'inline-block',
                        margin: '0 5px',
                    }}
                />
                <span
                    key={5}
                    style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: activeTableIndex === 5 ? 'yellow' : 'white',
                        borderRadius: '50%',
                        display: 'inline-block',
                        margin: '0 5px',
                    }}
                />
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
            setActiveTableIndex((prevIndex) => (prevIndex + 1) % 6);
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
            setActiveTableIndex((prevIndex) => (prevIndex - 1 + 6) % 6);
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
                data: [dpResults?.maxValue || null,400,417,417,417,420],
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data2 = {
        labels: selectedAlgorithms,
        datasets: [
            {
                label: 'Processing time',
                data: [dpResults?.exeTime || null,2,3,15,4,1],
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data3 = {
        labels: selectedAlgorithms,
        datasets: [
            {
                label: 'Memory used',
                data: [dpResults?.memoryUsed || null,2,3,15,4,1],
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
    function handleSubmit() {

        console.log('Items:', items);
        console.log('Capacity:', capacity);

        // Extracting weights and values from the items
        const weights = items.map(item => item.weight);
        console.log('Weights',weights);
        const values = items.map(item => item.value);
        console.log('values',values);

        // Prepare data for POST request
        const data = {
            values: values,
            weights: weights,
            capacity: capacity
        };

        // DP Algorithm
        if (selectedAlgorithms.includes("Dynamic Programming")) {
            console.log("Dynamic programming is selected.");
            axios.post('http://localhost:8080/knapsack01/dp', data)
                .then(response => {
                    console.log("DP Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setDpResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching DP results", error);
                });
        }
        // DP Algorithm
        if (selectedAlgorithms.includes("Brute Force Algorithm")) {
            console.log("Brute force is selected.");
            axios.post('http://localhost:8080/knapsack01/bf', data)
                .then(response => {
                    console.log("BF Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setBfResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching BF results", error);
                });
        }
        if (selectedAlgorithms.includes("Greedy Algorithm")) {
            console.log("Greedy algorithm is selected.");
            axios.post('http://localhost:8080/knapsack01/gra', data)
                .then(response => {
                    console.log("GRA Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setGraResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching GRA results", error);
                });
        }
        if (selectedAlgorithms.includes("Genetic Algorithm")) {
            console.log("Genetic algorithm is selected.");
            axios.post('http://localhost:8080/knapsack01/gena', data)
                .then(response => {
                    console.log("GENA Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setGenaResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching GENA results", error);
                });
        }
        if (selectedAlgorithms.includes("Ant Colony Optimization Algorithm")) {
            console.log("ACO is selected.");
            axios.post('http://localhost:8080/knapsack01/aco', data)
                .then(response => {
                    console.log("ACO Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setAcoResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching ACO results", error);
                });
        }
        if (selectedAlgorithms.includes("Branch and Bound")) {
            console.log("Branch and Bound is selected.");
            axios.post('http://localhost:8080/knapsack01/bnb', data)
                .then(response => {
                    console.log("BNB Results:", response.data);
                    const reversedItems = [...response.data.selectedItems].reverse();
                    setBnbResults({
                        ...response.data,
                        selectedItems: reversedItems
                    });
                })
                .catch(error => {
                    console.error("Error fetching BNB results", error);
                });
        }
        setIsSubmitted(true);
        // Wyłącz przycisk
        setIsButtonDisabled(true);

        // Ponownie włącz przycisk po 200 ms
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
                            maxHeight: 'calc(100vh - 50px - 200px)',
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
                            {/* Tabela dla Dynamic Programming */}
                            {activeTableIndex === 0 && dpResults && ( <div style={{display:'flex', margin:'auto', padding:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Dynamic Programming" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
                            {/* Tabela dla Brute Force */}
                            {activeTableIndex === 1 && dpResults && ( <div style={{display:'flex', margin:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Brute force" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
                            {/* Tabela dla Breach&Bound */}
                            {activeTableIndex === 2 && dpResults && ( <div style={{display:'flex', margin:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Breach&Bound" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
                            {/* Tabela dla Ant Colony Optimization */}
                            {activeTableIndex === 3 && dpResults && ( <div style={{display:'flex', margin:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Ant Colony Optimization" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
                            {/* Tabela dla Greedy Algorithm */}
                            {activeTableIndex === 4 && dpResults && ( <div style={{display:'flex', margin:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Greedy Algorithm" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
                            {/* Tabela dla Genetic Algorithm */}
                            {activeTableIndex === 5 && dpResults && ( <div style={{display:'flex', margin:'auto'}}>
                                    <button onClick={handlePrev} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px", fontSize:"25px"}}>←</button>
                                    <div className={`table-container ${isTransitioning ? 'transitioning' : ''} ${isAppearing ? 'appearing' : ''}`} style={{border:'2px solid black',margin:'0',width:'100%', borderRadius:'0', backgroundColor:'lightgrey'}}>
                                        <KnapsackTable title="Genetic Algorithm" data={dpResults} />
                                    </div>
                                    <button onClick={handleNext} className="custom-button" style={{alignSelf:"center",height:"50px", width:"50px",fontSize:"25px"}}>→</button>
                                </div>
                            )}
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