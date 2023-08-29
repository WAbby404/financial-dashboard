import React, { useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Transactions(props) {
    const [ user ] = useAuthState(auth);

    useEffect(()=> {
        console.log('Transaction useeffect called');
        // can maybe useMemo or usecallback here? transaction useeffect is called everytime modal is turned on etc
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/transactions');
        // console.log(user.uid);
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

    const renderSwitch = (items) => {
        switch(true) {
            // case for 1 transaction
            case (items.length === 1):
                return (
                    <li key={items[0].id}>
                        <div className="flex flex-col justify-center p-1 md:flex-row-reverse md:w-full md:justify-between md:gap-2">
                            <div className={`${props.modalOn ? 'flex flex-col md:flex-row md:w-full md:gap-1 md:items-center' : 'flex justify-between w-full' }`}>
                                <div className="basis-1/3 text-left">
                                    <div className={`${items[0].category === 'Transfer' ? 'text-yellow-400' : (items[0].positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>{items[0].name}</div>
                                    <div className="text-indigo-300 text-sm">{items[0].transferTo ? `Transfer to ${items[0].transferTo}` : items[0].category}</div>
                                </div>
                                <div className={`${props.modalOn ? 'text-left md:text-center' : 'text-center self-center' } text-indigo-300 basis-1/3`}>
                                    {items[0].date}
                                </div>
                                <div className={`${props.modalOn ? 'text-left md:text-right' : 'text-right' } basis-1/3`}>
                                    <div className={`${items[0].category === 'Transfer' ? 'text-yellow-400' : (items[0].positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>
                                        {items[0].category === 'Transfer' ? '' : (items[0].positive ? '+' : '-')}
                                        $
                                        {items[0].value}
                                    </div>
                                    <div className="text-indigo-300 text-sm">
                                        {items[0].transferTo ? `from ${items[0].account}` : items[0].account}
                                    </div>
                                </div>
                            </div>
                            { props.modalOn &&
                            <div className="flex flex-col gap-2">
                                    <Button size="small" color="secondary" variant="outlined" 
                                        onClick={() => editTransaction(items[0], 0)}
                                        disabled={props.editOn ? true : false}
                                        sx={{color: 'orange'}}>
                                        <EditIcon/>
                                    </Button>
                                    <Button size="small" variant="outlined" color="error"
                                        onClick={() => deleteTransaction(items[0], 0)}
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
                            <li key={item.id}>
                                <div className="flex flex-col justify-center p-1 md:flex-row-reverse md:w-full md:justify-between md:gap-2">
                                    <div className={`${props.modalOn ? 'flex flex-col md:flex-row md:w-full md:gap-1 md:items-center' : 'flex justify-between w-full' }`}>
                                        <div className="basis-1/3 text-left">
                                            <h3 className={`${item.category === 'Transfer' ? 'text-yellow-400' : (item.positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>{item.name}</h3>
                                            <div className="text-indigo-300 text-sm">{item.transferTo ? `Transfer to ${item.transferTo}` : item.category}</div>
                                        </div>
                                        <div className={`${props.modalOn ? 'text-left md:text-center' : 'text-center self-center' } text-indigo-300 basis-1/3`}>
                                            {item.date}
                                        </div>
                                        <div className={`${props.modalOn ? 'text-left md:text-right' : 'text-right' } basis-1/3`}>
                                            <h3 className={`${item.category === 'Transfer' ? 'text-yellow-400' : (item.positive ? 'text-green-600' : 'text-rose-600')} font-bold`}>
                                                { item.category === 'Transfer' ? '' : (item.positive ? '+' : '-')}
                                                $
                                                {item.value}
                                            </h3>
                                            <div className="text-indigo-300 text-sm">
                                                {item.transferTo ? `From ${item.account}` : item.account}
                                            </div>
                                        </div>
                                    </div>
                                    { props.modalOn &&
                                        <div className="flex md:flex-col xl:gap-2">
                                            <Button size="small" color="secondary" variant="outlined"
                                                onClick={() => editTransaction(item, index)} 
                                                disabled={props.editOn ? true : false}
                                                sx={{color: 'orange'}}>
                                                    <EditIcon/>
                                            </Button>
                                            <Button size="small" variant="outlined" color="error"
                                                sx={{color: 'red'}}
                                                onClick={() => deleteTransaction(item, index)} data-testid="transactionDelete">
                                                    <DeleteIcon/>
                                            </Button>
                                        </div>
                                    }
                                </div>
                                <div className="w-5/6 h-0.5 bg-indigo-800 m-auto xl:my-2"></div>
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
        <ul className="pr-1 xl:pr-3">
            {renderSwitch(props.allTransactions)}
        </ul>
    </div>
    );
}

export default Transactions;
