import React, { useState } from 'react';
import TransactionsModal from './TransactionsModal';
import Transactions from './Transactions';
import './Transactions.css';

function TransactionsDashboard() {
    const [ modal, setModal ] = useState(false);
    // items = [{ name: 'Wegmans', category: 'Food', date: 22, positive: false, reoccuring: false, value: 32.59, id: 1},
    // { name: 'kPot', category: 'Food', date: 3, positive: false, reoccuring: false, value: 99.73, id: 2},
    // { name: 'gma', category: 'Income', date: 11, positive: true, reoccuring: true, value: 25, id: 3}];

    const modalStatus = () => {
        setModal(!modal)
    }

    return (
        <section>
            <div>
            { !modal ? 
                <div className="transactionsDashboard">
                    <div>Transaction Dashboard</div>
                        <Transactions />
                    <button onClick={ () => { setModal(!modal)} }>Manage Transactions</button>
                </div>
            :
                <div>
                    <TransactionsModal modalStatus={modalStatus} />
                </div>
                }
            </div>
        </section>
    );
}

export default TransactionsDashboard;