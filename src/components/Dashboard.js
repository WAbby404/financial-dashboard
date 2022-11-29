import React from 'react';
import TransactionsModal from './Transactions/TransactionsModal';

function Dashboard(props) {
    return(
        <div>
            <h1>Dashboard</h1>
            <TransactionsModal />
        </div>
    )
}

export default Dashboard;