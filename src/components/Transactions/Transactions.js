import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Transactions(props) {
    const [ user ] = useAuthState(auth);
    const [ count, setCount ] = useState(0);

    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/transactions');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                // if snapshot id is found in the alltransactions array dont add it
                let check = props.allTransactions.some(item => item.id === childData.id);
                if(!check){
                    let oldTransactions = props.allTransactions;
                    oldTransactions.push(childData);
                    props.toSetAllTransactions(oldTransactions);
                }
                setCount(count + 1);
            })});
    }, []); // eslint-disable-line

    const deleteTransaction = (transacitonToDelete, index) => {
        props.deleteTransaction(transacitonToDelete, index);
    }

    const editTransaction = (transaction, index) => {
        props.editTransaction(transaction);
        props.deleteTransaction(transaction, index, true);
    }

    // sort transactions in decending order by date 
    const sortTransactions = transactions => {
        if(transactions.length !== 1){
            let tempArray = transactions;
            tempArray.sort((a, b) => b.date - a.date);
            return tempArray;
        }
    };

    const formatDate = (date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = months[new Date().getMonth()];
        return (
            <div className="flex m-auto gap-0.5 md:justify-center">
                <div className="text-sm pr-1">{currentMonth}</div>
                {date}
            </div>
        )
    };

    const formatMoney = (money, transaction) => {
        let formattedMoney = money.split('.');
        let newMoney = [];
        if(formattedMoney[0].length > 3){
            let stringArray = formattedMoney[0].split('');
            while(stringArray.length){
                newMoney.push(stringArray[0]);
                stringArray.shift();
                if(stringArray.length % 3 === 0 && stringArray.length !== 0){
                    newMoney.push(',');
                }
            }
            newMoney.join('');
        }
        return(
            <div className={`${props.modalOn ? 'md:justify-end' : 'justify-end' } flex`}>
                <div>{transaction.category === 'Transfer' ? '' : (transaction.positive ? '+' : '-')}</div>
                <div className="self-center">$</div>
                <div>{newMoney.length > 0 ? newMoney : formattedMoney[0]}</div>
                <div className="text-xs self-center">.{formattedMoney[1] ? formattedMoney[1] : '00'}</div>
            </div>
        )
    };

    const renderSwitch = (items) => {
        switch(true) {
            // case for 1 transaction
            case (items.length === 1):
                return (
                    <li key={items[0].id} data-testid={`transaction-0`}>
                        <div className="flex flex-col justify-center p-1 md:flex-row-reverse md:w-full md:justify-between md:gap-2">
                            <div className={`${props.modalOn ? 'flex flex-col md:flex-row md:w-full md:gap-1 md:items-center md:justify-between' : 'flex justify-between w-full' }`}>
                                <div className="basis-2/6 text-left">
                                    <h3 className={`${items[0].category === 'Transfer' ? 'text-yellow-400' : (items[0].positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>{items[0].name}</h3>
                                    <div className="text-indigo-900 dark:text-indigo-300 text-sm">{items[0].transferTo ? `Transfer to ${items[0].transferTo}` : items[0].category}</div>
                                </div>
                                <div className={`${props.modalOn ? 'text-left md:text-center' : 'text-center self-center' } text-indigo-900 dark:text-indigo-300 basis-1/6`}>
                                    {formatDate(items[0].date)}
                                </div>
                                <div className={`${props.modalOn ? 'text-left md:text-right' : 'text-right' } basis-2/6`}>
                                    <h4 className={`${items[0].category === 'Transfer' ? 'text-yellow-400' : (items[0].positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>
                                        {formatMoney(items[0].value, items[0])}
                                    </h4>
                                    <div className="text-indigo-900 dark:text-indigo-300 text-sm">
                                        {items[0].transferTo ? `from ${items[0].account}` : items[0].account}
                                    </div>
                                </div>
                            </div>
                            { props.modalOn &&
                            <div className="flex flex-col gap-2">
                                    <Button size="small" 
                                        color="secondary" 
                                        variant="outlined" 
                                        onClick={() => editTransaction(items[0], 0)}
                                        disabled={props.editOn ? true : false}
                                        data-testid='transactionEdit-0'
                                        aria-label='Edit transaction'
                                        sx={{color: 'orange'}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button size="small" 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => deleteTransaction(items[0], 0)}
                                        data-testid="transactionDelete-0"
                                        aria-label='Delete transaction'
                                        sx={{color: 'red'}}>
                                        <DeleteIcon/>
                                    </Button>
                            </div>
                        }
                        </div>
                    </li>
                );

            // case for multiple transactions
            case (items.length > 1):
                return (
                    sortTransactions(items).map((item, index) => {
                        return(
                            <li key={item.id} data-testid={`transaction-${index}`}>
                                <div className="flex flex-col justify-center p-1 md:flex-row-reverse md:w-full md:justify-between md:gap-2">
                                    <div className={`${props.modalOn ? 'flex flex-col md:flex-row md:w-full md:gap-1 md:items-center md:justify-between' : 'flex justify-between w-full' }`}>
                                        <div className="basis-2/6 text-left">
                                            <h3 className={`${item.category === 'Transfer' ? 'text-yellow-400' : (item.positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>{item.name}</h3>
                                            <div className="text-indigo-900 dark:text-indigo-300 text-sm">{item.transferTo ? `Transfer to ${item.transferTo}` : item.category}</div>
                                        </div>
                                        <div className={`${props.modalOn ? 'text-left md:text-center' : 'self-center' } text-indigo-900 dark:text-indigo-300 basis-1/6`}>
                                            {formatDate(item.date)}
                                        </div>
                                        <div className={`${props.modalOn ? 'text-left md:text-right ' : 'text-right' } basis-2/6`}>
                                            <h4 className={`${item.category === 'Transfer' ? 'text-yellow-400' : (item.positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>
                                                {formatMoney(item.value, item)}
                                            </h4>
                                            <div className="text-indigo-900 dark:text-indigo-300 text-sm">
                                                {item.transferTo ? `From ${item.account}` : item.account}
                                            </div>
                                        </div>
                                    </div>
                                    { props.modalOn &&
                                        <div className="flex md:flex-col xl:gap-2">
                                            <Button size="small" 
                                                color="secondary" 
                                                variant="outlined"
                                                onClick={() => editTransaction(item, index)} 
                                                disabled={props.editOn ? true : false}
                                                data-testid={`transactionEdit-${index}`}
                                                aria-label='Edit transaction'
                                                sx={{color: 'orange'}}>
                                                    <EditIcon/>
                                            </Button>
                                            <Button size="small" 
                                                variant="outlined" 
                                                color="error"
                                                sx={{color: 'red'}}
                                                data-testid={`transactionDelete-${index}`}
                                                aria-label='Delete transaction'
                                                onClick={() => deleteTransaction(item, index)}>
                                                    <DeleteIcon/>
                                            </Button>
                                        </div>
                                    }
                                </div>
                                <div className="w-5/6 h-0.5 bg-indigo-200 dark:bg-indigo-800 m-auto xl:my-2"></div>
                            </li>
                        );
                    })
                );
                
            // case for 0 transactions
            default:
                return <div className='text-indigo-300 font-medium text-center m-auto'>Transaction list empty{!props.modalOn && ', add a goal in Manage Transactions'}</div>;
        }
    };

return (
    <div className={`${ props.modalOn ? 'basis-40 sm:basis-5/12 sm:max-h-screen md:basis-2/3 xl:basis-3/6' : 'md:w-10/12 md:m-auto'} h-full overflow-y-auto`}>
        <ul className="pr-1 xl:pr-3" data-testid={props.modalOn ? 'transactionsListModal' : 'transactionsList'}>
            {renderSwitch(props.allTransactions)}
        </ul>
    </div>
    );
}

export default Transactions;