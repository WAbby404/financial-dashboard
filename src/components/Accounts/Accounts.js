import React, { useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Accounts(props) {
    const [ user ] = useAuthState(auth);

    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts');
        let newAccounts = [];
        onValue(dbRef, (snapshot) => {
            // each item under accounts db
            newAccounts = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if(!childData.id){
                    const baseAccounts = Object.values(childData);
                    newAccounts.push(...baseAccounts);
                } else {
                    newAccounts.push(childData);
                }
                props.toSetAllAccounts(newAccounts);
        })});
    }, []); // eslint-disable-line

    const editAccount = (accountToEdit, index) => {
        props.editAccount(accountToEdit, index);
        props.deleteAccount(accountToEdit, index, true);
    };

    const deleteAccount = (accountToDelete, index) => {
        props.deleteAccount(accountToDelete, index);
    };

    const sortAccounts = (accounts) => {
        let sortedBaseArray = [];
        let sortedArray = [];
        let index = 0;
        while(index <= accounts.length -1){
            if(accounts[index].hasOwnProperty('notEditable')){
                sortedBaseArray.push(accounts[index]);
                index += 1;
            } else {
                sortedArray.push(accounts[index]);
                index += 1;
            }
        }
        sortedBaseArray.push(...sortedArray);
        sortedBaseArray = sortedBaseArray.flat();
        return sortedBaseArray;
    };

    const renderAccounts = (allAccounts) => {
            return (
                sortAccounts(allAccounts).map((account, index) => {
                    return (
                        <li key={account.id} className={`pb-2 flex flex-col ${props.modalOn ? 'md:flex-row' : ''}`}>
                            <div className="flex flex-col md:justify-center md:w-full">
                                <h3 className="text-indigo-800 font-medium pl-3 md:text-lg dark:text-indigo-300">{account.name}</h3>
                                <div className="flex justify-center">
                                    {/* {console.log(account.total)} */}
                                    <h4 className={`${account.debit ? 'text-green-600' : 'text-rose-600'} font-bold text-3xl xl:text-5xl ${props.modalOn ? '' : 'text-4xl '}`}>
                                        <span className="">$</span>
                                        {account.total > 0 ?  account.total : account.total * -1}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex justify-center gap-1 md:flex-col">
                                {props.modalOn && !account.notEditable &&
                                    <Button onClick={() => editAccount(account, index)} size="small" color="secondary" variant="outlined"
                                        disabled={props.editOn ? true : false}
                                        sx={{color: 'orange'}}>
                                        <EditIcon/>
                                    </Button>}
                                {props.modalOn  && !account.notEditable && 
                                    <Button onClick={() => deleteAccount(account, index)} size="small" color="error" variant="outlined"
                                        sx={{color: 'red'}}>
                                        <DeleteIcon/>
                                    </Button>}
                            </div>
                            {/* <div className="w-4/6 h-0.5 bg-indigo-800 m-auto"></div> */}
                        </li>
                    )
                })
            )
    };

    return (
        <article className={`${ props.modalOn ? 'basis-40 md:basis-1/2 xl:basis-2/5' : ''} h-full overflow-y-auto`}>
            <ul className="">
                {renderAccounts(props.allAccounts)}
            </ul>
        </article>
    );
}

export default Accounts;