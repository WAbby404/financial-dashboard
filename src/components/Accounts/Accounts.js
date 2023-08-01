import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Accounts(props) {
    const [ count, setCount ] = useState(0);
    const [ user ] = useAuthState(auth);

    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                // console.log(childSnapshot);
                // console.log(childSnapshot.val());
                // console.log(typeof childSnapshot.val());
                // console.log(childSnapshot.val().id);
                const childData = childSnapshot.val();
                setCount(count + 1);
                // if snapshot id is found in the allAccounts array dont add it
                
                // console.log(oldAccounts);
                // if(!childSnapshot.val().id){
                    // console.log('inside if reached');
                    // console.log(childSnapshot.val());
                //     const initalizedAccounts = childSnapshot.val();
                //     Object.keys(initalizedAccounts).forEach(key => {
                //         // console.log(key, initalizedAccounts[key]);
                //         // if(oldAccounts)
                //         console.log(initalizedAccounts[key]);
                //         // oldAccounts.push(initalizedAccounts[key]);
                //     });
                // }
                let oldAccounts = props.allAccounts;
                let check = props.allAccounts.some(item => item.id === childData.id);
                if(!check){
                    oldAccounts.push(childData);
                    props.toSetAllAccounts(oldAccounts);
                }
            })});
    }, []);

    const editAccount = (accountToEdit, index) => {
        props.editAccount(accountToEdit, index);
        setCount(count + 1);
    };

    const deleteAccount = (accountToDelete, index) => {
        props.deleteAccount(accountToDelete, index);
        setCount(count + 1);
    }

    const renderAccounts = (allAccounts) => {
        if(allAccounts?.length !== 0){
            // console.log(allAccounts);
            let newAllAccounts;
            let initializedAccounts = allAccounts[0];
            // console.log(allAccounts);
            // console.log(Object.values(initializedAccounts));
            let otherAccounts = allAccounts.slice(1);
            // console.log(otherAccounts);
            newAllAccounts = Object.values(initializedAccounts)
            if(otherAccounts){
                newAllAccounts.push(...otherAccounts);
            }
            // console.log(newAllAccounts);
            return (
                newAllAccounts.map((account, index) => {
                    return (
                        <li key={account.id}>
                            <h4>{account.name}</h4>
                            <div className="flex">
                                {/* will need to reevaluate this later, like if checking acc is negative */}
                                <span>{account.checkingAccount ? '+' : '-'}</span>
                                <h5 className={account.checkingAccount ? 'green' : 'red'}>{account.total}</h5>
                            </div>
                            {props.modalOn && !account.notEditable &&
                                <Button onClick={() => editAccount(account, index)} size="small" color="error" variant="outlined">
                                    <EditIcon/>
                                </Button>}
                            {props.modalOn  && !account.notEditable && 
                                <Button onClick={() => deleteAccount(account, index)} size="small" variant="contained">
                                    <DeleteIcon/>
                            </Button>}
                        </li>
                    )
                })
            )
        }
    };

    return (
        <div className="accounts">
            <ul>
                {renderAccounts(props.allAccounts)}
            </ul>
        </div>
    );
}

export default Accounts;