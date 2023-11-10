import React from "react";

function renderCircles() {
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