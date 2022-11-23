import React, { useState } from 'react';
import './Transactions.css';

function Transactions(incomingTransactions) {
    // const [allTransactions, setAllTransactions] = useState([]);
    // save incoming props to state when changed

    function sortTransactions(transactions) {
        // sort transactions in decending order by date 
        let tempArray = transactions;
        tempArray.sort((a, b) => b.date - a.date);
        return tempArray;
    };

    return (
        <section>
            <div>
                <div className="transactions">
                    <div>Transactions</div>
                    {(incomingTransactions.allTransactions === undefined || incomingTransactions.allTransactions.length === 0) ?
                    <div>Transaction list empty</div> :
                    <div>
                        <ul>
                            {sortTransactions(incomingTransactions.allTransactions).map(item => {
                                return(
                                    <li key={item.id}>
                                        {console.log('return transaction reached')}
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
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>}
                </div>
            </div>
        </section>
    );
}

export default Transactions;