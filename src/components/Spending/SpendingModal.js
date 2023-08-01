import React, { useState } from 'react';
import Spending from './Spending';
import './Spending.css';
import '../Dashboard.css';

function SpendingModal(props) {
    const [ spendingValues, setSpendingValues ] = useState([]);

    const toSetAllSpendingValues = (newSpendingValues) => {
        setSpendingValues(newSpendingValues);
        console.log('newspending values');
        console.log(newSpendingValues);
    }

    return (
        <div className="modal spendingModal">
            <h3 className="modal--title">Spending</h3>
            <Spending 
                spendingValues={spendingValues}
               toSetAllSpendingValues={toSetAllSpendingValues} />
            <button className="btn">Manage Spending</button>
        </div>
    );
}

export default SpendingModal;