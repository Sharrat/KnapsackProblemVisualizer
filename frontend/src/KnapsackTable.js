import React from 'react';

function KnapsackTable({ title, data }) {
    return (
        <div>
            <h3>{title}</h3>
            <table style={{ width: '100%', margin:'auto', borderCollapse: 'collapse', borderRadius:'10px' }}>
                <tbody>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}>
                        <strong>Max Value</strong>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>
                        {data.maxValue}
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}>
                        <strong>Number of Selected Items</strong>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>
                        {data.selectedItems.length}
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}>
                        <strong>Selected Items</strong>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>
                        {data.selectedItems.join(', ')}
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}>
                        <strong>Processing time</strong>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>
                        ~{data.exeTime} ns
                    </td>
                </tr>
                <tr>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'lightgoldenrodyellow' }}>
                        <strong>Memory usage</strong>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'white' }}>
                        {data.memoryUsed} bytes
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default KnapsackTable;