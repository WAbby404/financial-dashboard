import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, push, set } from "firebase/database";
// , onValue, remove, get
import Accounts from './Accounts';
import AccountsForm from './AccountsForm';
import Button from '@mui/material/Button';
import './Accounts.css';
import '../Dashboard.css';


function AccountsModal(props) {
    const [ user ] = useAuthState(auth);
    // Represents all Accounts, read from database
    const [ allAccounts, setAllAccounts ] = useState([]);
    const [ modalOn, setModalOn ] = useState(false);
    const [ formOn, setFormOn ] = useState(false);

    const [ count, setCount ] = useState(0);

    const toSetFormOn = () => {
        setFormOn(true);
    };

    const toSetFormOff = () => {
        setFormOn(false);
        // setExitWithCancelOn(false);
    };

    const toSetModalOn = () => {
        setModalOn(true);
    }

    const toSetModalOff = () => {
        // setExitWithCancelOn(false);
        // alerts with dialog box while goal is being edited
        // if(editOn){
        //     setDialogBoxOn(true);
        // } else {
            setModalOn(!modalOn);
            setFormOn(false);
            // setEditOn(false);
        // }
    };

    const toSetAllAccounts = (newAccounts) => {
        setAllAccounts(newAccounts);
    };

    const editAccount = () => {

    };

    const deleteAccount = () => {

    };

    const createAccount = (cleanFormValues) =>{
        const db = getDatabase();
        const postListRef = ref(db, user.uid + '/accounts');
        const newPostRef = push(postListRef);
        set(newPostRef, {
            ...cleanFormValues
        });
        setCount(count + 1);
        // setEditOn(false);
        // setSuccessSnackBarOn(true);
    };

    return (
        <div className="modal accountsModal">
            <div className="goals__spacebetween">
                <h3 className="modal--title">
                    Accounts
                </h3>
                <Button className="btn" onClick={() => toSetModalOn()}>
                    Manage Accounts
                </Button>
            </div>
            <Accounts
                allAccounts={allAccounts}
                toSetAllAccounts={toSetAllAccounts}
                darkMode={props.darkMode}/>
            { modalOn && 
                <div className='overlay'>
                    <div className='overlay__modal'>
                        <div className="overlay__title--spacing">
                            <h3 className="modal--title">Accounts</h3>
                            <Button className="btn" onClick={() => toSetModalOff()}>
                                X
                            </Button>
                        </div>
                        <div className="overlay--spacing">
                            <Accounts
                                modalOn={modalOn}
                                allAccounts={allAccounts}
                                toSetAllAccounts={toSetAllAccounts}
                                darkMode={props.darkMode}
                                editAccount={editAccount}
                                deleteAccount={deleteAccount}
                            />
                            <AccountsForm
                                formOn={formOn}
                                toSetFormOn={toSetFormOn}
                                toSetFormOff={toSetFormOff}
                                createAccount={createAccount}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default AccountsModal;