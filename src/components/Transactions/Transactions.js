import React, { useEffect, useState } from 'react';
import './Transactions.css';

function Transactions(props) {
    const [oldId, setOldId] = useState(0);
    const [allTransactions, setAllTransactions] = useState([]);
    const [count, setCount] = useState(0);
    // updating slow when element is deleted

    // save incoming props to state on change 
    useEffect(()=> {
        // if a transaction id from props exists & is not the same id as the old transaciton, add it to the list of all transactions
        if(props.newTransaction?.id && props.newTransaction.id !== oldId){
            const oldTransactions = allTransactions;
            setOldId(props.newTransaction.id);
            setAllTransactions([...oldTransactions, props.newTransaction]);
        }
         // eslint-disable-next-line
    },[props.newTransaction])

    // sort transactions in decending order by date 
    const sortTransactions = transactions => {
        if(transactions.length !== 1){
            let tempArray = transactions;
            tempArray.sort((a, b) => b.date - a.date);
            return tempArray;
        }
    };

    const deleteTransaction = (idToDelete) => {
        const index = allTransactions.findIndex(transaction => transaction.id === idToDelete.id);
        const beforeDelete = allTransactions;
        beforeDelete.splice(index, 1);
        setAllTransactions(beforeDelete);
        setCount(count +1);
    };

    const renderSwitch = (items) => {
        switch(true) {
            // case for 1 transaction
            case (items.length === 1):
                return (
                    <li key={items[0].id}>
                        {items[0].name}
                        <br/>
                        {items[0].category}
                        <br/>
                        {items[0].reoccuring ? 'yes': 'no'}
                        <div data-testid='date'>{items[0].date}</div>
                        <div>
                        {items[0].positive ? '+' : '-' }
                        {items[0].value}
                        </div>
                        <br/>
                        {props.deleteMode && <button onClick={() => deleteTransaction(items)}>Delete</button>}
                    </li>
                );

            // case for multiple transactions
            case (items.length > 1):
                return (
                    sortTransactions(items).map(item => {
                        return(
                            <li key={item.id}>
                                {item.name}
                                <br/>
                                {item.category}
                                <br/>
                                {item.reoccuring ? 'yes': 'no'}
                                <div data-testid='date'>{item.date}</div>
                                <div>
                                    {item.positive ? '+' : '-' }
                                    {item.value}
                                </div>
                                <br/>
                                {props.deleteMode && <button onClick={() => deleteTransaction(item)}>Delete</button>}
                            </li>
                        );
                    })
                );
                
            // case for 0 transactions
            default:
                return <div>Transaction list empty</div>;
        }
    };

return (
        <section>
            <div>
                <div className="transactions">
                    <div>Transactions</div>
                    {renderSwitch(allTransactions)}
                </div>
            </div>
        </section>
    );
}


export default Transactions;