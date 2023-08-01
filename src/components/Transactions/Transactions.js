import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { RxCounterClockwiseClock } from "react-icons/rx";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Transactions.css';

function Transactions(props) {
    const [ count, setCount ] = useState(0);
    const [ user ] = useAuthState(auth);

    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/transactions');
        // console.log(user.uid);
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                setCount(count + 1);
                // if snapshot id is found in the alltransactions array dont add it
                let check = props.allTransactions.some(item => item.id === childData.id);
                if(!check){
                    let oldTransactions = props.allTransactions;
                    oldTransactions.push(childData);
                    props.toSetAllTransactions(oldTransactions);
                }
            })});
    }, []);

    const deleteTransaction = (transacitonToDelete, index) => {
        props.deleteTransaction(transacitonToDelete, index);
        setCount(count + 1);
    }

    const editTransaction = (transaction, index) => {
        props.editTransaction(transaction);
        props.deleteTransaction(transaction, index);
        setCount(count + 1);
    }

    // sort transactions in decending order by date 
    const sortTransactions = transactions => {
        if(transactions.length !== 1){
            let tempArray = transactions;
            tempArray.sort((a, b) => b.date - a.date);
            return tempArray;
        }
    };

    const renderSwitch = (items) => {
        switch(true) {
            // case for 1 transaction
            case (items.length === 1):
                return (
                    <li key={items[0].id} className="transaction">
                        <div className="flex">
                            <div className="flex-stack">
                                {props.modalOn && 
                                    <Button size="small" color="error" variant="outlined" onClick={() => editTransaction(items[0], 0)}>
                                        <EditIcon/>
                                    </Button>
                                }
                                {props.modalOn && 
                                    <Button size="small" variant="contained" onClick={() => deleteTransaction(items[0], 0)}>
                                        <DeleteIcon/>
                                    </Button>
                                }
                            </div>
                        </div>
                        <div className="transaction">
                            <div>
                                <div className={`${items[0].positive ? 'transaction--positive' : 'transaction--negative'}`}>{items[0].name}</div>
                                <div className="transaction--category">{items[0].category}</div>
                            </div>
                            <div className="flex">
                                <div>{items[0].date}</div>
                            </div>
                            <div className="flex-stack">
                                <div className={`${items[0].positive ? 'transaction--positive' : 'transaction--negative'}`}>
                                    {items[0].positive ? '+' : '-' }
                                    $
                                    {items[0].value}
                                </div>
                                <div>
                                    {items[0].account}
                                </div>
                            </div>
                        </div>
                    </li>
                );

            // case for multiple transactions
            case (items.length > 1):
                return (
                    sortTransactions(items).map((item, index) => {
                        return(
                            <li key={item.id}>
                                <div className="flex">
                                    <div className="flex-stack">
                                        {props.modalOn && 
                                            <Button size="small" color="error" variant="outlined" 
                                                onClick={() => editTransaction(item, index)}><EditIcon/></Button>
                                        }
                                        {props.modalOn && 
                                            <Button size="small" variant="contained"
                                                onClick={() => deleteTransaction(item, index)} data-testid="transactionDelete"><DeleteIcon/></Button>
                                        }
                                    </div>
                                    <div className="transaction">
                                        <div>
                                            <div className={`${item.positive ? 'transaction--positive' : 'transaction--negative'}`}>{item.name}</div>
                                            <div className="transaction--category">{item.category}</div>
                                        </div>
                                        <div className="flex">
                                            <div>{item.reoccuring ? <RxCounterClockwiseClock /> : ''}</div>
                                            <div>{item.date}</div>
                                        </div>
                                        <div className="flex-stack">
                                            <div className={`${item.positive ? 'transaction--positive' : 'transaction--negative'}`}>
                                                {item.positive ? '+' : '-' }
                                                $
                                                {item.value}
                                            </div>
                                            <div>
                                                {item.account}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                                <hr/>
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
    <div className="transactions">
        <ul className="transactions__list">
            {renderSwitch(props.allTransactions)}
        </ul>

    </div>
    );
}

export default Transactions;
