import React, { useState } from 'react';
import axios from "axios";
import './ButtonStyles.css';
import './InputStyles.css';
import './HeaderStyles.css'
import { Bar } from "react-chartjs-2";
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";
function KnapsackInput() {
    ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);
    const [numItems, setNumItems] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [items, setItems] = useState([]);
    const [minRandom, setMinRandom] = useState(1);
    const [maxRandom, setMaxRandom] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState(null);
    const [dpResults, setDpResults] = useState(null);
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
                display: true,
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
        labels: ['DP','BF','GA','B&B','Recursion','Genetic'],
        datasets: [
            {
                label: 'Max Value',
                data: [dpResults?.maxValue || 0,400,417,417,417,420],
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data2 = {
        labels: ['DP','BF','GA','B&B','Recursion','Genetic'],
        datasets: [
            {
                label: 'Processing time',
                data: [dpResults?.exeTime,2,3,15,4,1],
                backgroundColor:'lightyellow',
            },
        ],
    };
    const data3 = {
        labels: ['DP','BF','GA','B&B','Recursion','Genetic'],
        datasets: [
            {
                label: 'Processing time',
                data: [dpResults?.exeTime || 0,2,3,15,4,1],
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



    return (
        <div style={{Height:'100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ background: '#333', color: '#fff', padding: '10px',height:'40px', textAlign: 'center' }}>
                <p className="site-title" style={{textAlign:"center"}}><b>Knapsack problem visualizer</b></p>
            </div>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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

                                {items.length > 0 && (
                                    <>
                                    <div style={{margin:'auto'}}>
                                            <button className="custom-button" style={{width:'190px'}} onClick={handleSubmit}>Solve</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={randomizeWeights}>Randomize Weights</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={randomizeValues}>Randomize Values</button>
                                            <br></br>
                                            <button className="custom-button" style={{width:'190px'}} onClick={toggleModal}>Set Randomization Range</button>
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
                <div style={{minHeight:'calc(100vh - 60px - 50px)',maxHeight:'calc(100vh - 120px - 50px)' ,overflowY: 'auto', overflowX:'hidden', borderRight: '1px solid #000', boxSizing: 'border-box', backgroundColor:'grey', width: '50%', padding:'0px'}}>
                    <h3>Results</h3>
                    {dpResults && (
                        <div>
                            <div style ={{border:'2px solid black',margin:'auto',width:'75%', borderRadius:'30px 30px 0 0', backgroundColor:'lightgrey'}}>
                                <h3>Dynamic Programming</h3>
                                <table style={{ width: '100%',margin:'auto', borderCollapse: 'collapse', borderRadius:'10px' }}>
                                    <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}><strong>Max Value</strong></td>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>{dpResults.maxValue}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}><strong>Number of Selected Items</strong></td>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>{dpResults.selectedItems.length}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}><strong>Selected Items</strong></td>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>{dpResults.selectedItems.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}><strong>Processing time</strong></td>
                                        <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>~{dpResults.exeTime} ns</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {dpResults && (
                        <div>
                            <div style={{margin:'auto',padding:'auto', width:"650px"}}>
                                <br></br>
                                <label><b>Max value comparison chart</b></label>
                                <Bar options={option} data={data} style={{width:'300px',height:'300px',margin:'auto'}}/>
                            </div>
                            <div style={{margin:'auto',padding:'auto', width:"650px"}}>
                                <br></br>
                                <label><b>Processing time comparison chart</b></label>
                                <Bar options={option} data={data2} style={{width:'300px',height:'300px',margin:'auto'}}/>
                            </div>
                            <div style={{margin:'auto',padding:'auto', width:"650px"}}>
                                <Bar options={option} data={data3} style={{width:'300px',height:'300px',margin:'auto'}}/>
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