import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";
import Accounts from './Accounts';
import AccountsForm from './AccountsForm';
import Button from '@mui/material/Button';
import EditDialogBox from '../EditDialogBox';
import SuccessSnackbar from '../SuccessSnackbar';
import ErrorSnackbar from '../ErrorSnackbar';
import DeleteSnackbar from '../DeleteSnackbar';

function AccountsModal(props) {
    const [ user ] = useAuthState(auth);
    // Represents all Accounts, read from database
    const [ allAccounts, setAllAccounts ] = useState([]);
    const [ modalOn, setModalOn ] = useState(false);
    const [ formOn, setFormOn ] = useState(false);

    const [ editOn, setEditOn ] = useState(false);
    const [ accountToEdit, setAccountToEdit ] = useState(null); 
    const [ successSnackbarOn, setSuccessSnackbarOn ] = useState(false);
    const [ errorSnackbarOn, setErrorSnackbarOn ] = useState(false);
    const [ deleteSnackbarOn, setDeleteSnackbarOn ] = useState(false);
    const [ dialogBoxOn, setDialogBoxOn ] = useState(false);
    const [ exitWithCancelOn, setExitWithCancelOn ] = useState(false);

    const toSetFormOn = () => {
        setFormOn(true);
    };

    const toSetFormOff = () => {
        setFormOn(false);
        setExitWithCancelOn(false);
    };

    const toSetModalOn = () => {
        setModalOn(true);
        const body = document.querySelector("body");
        body.style.overflow = "hidden";
    }

    const toSetModalOff = () => {
        setExitWithCancelOn(false);
        // alerts with dialog box while goal is being edited
        if(editOn){
            setDialogBoxOn(true);
        } else {
            setModalOn(!modalOn);
            setFormOn(false);
            const body = document.querySelector("body");
            body.style.overflow = "auto";
            setEditOn(false);
            toSetSuccessSnackbarOff();
            toSetErrorSnackbarOff();
            toSetDeleteSnackbarOff();
        }
    };

    const toSetEditOn = () => {
        setEditOn(true);
    };

    const toSetEditOff = () => {
        setEditOn(false);
    };

    // Sets which goal to edit, turn on form  & edit mode for GoalsForm useEffect
    const editAccount = (goalToEdit, index) => {
        setAccountToEdit(goalToEdit, index);
        setEditOn(true);
        setFormOn(true);
    };

    const toSetAllAccounts = (newAccounts) => {
        setAllAccounts(newAccounts);
    };

    const toSetExitWithCancelOn = () => {
        setExitWithCancelOn(true);
    }

    // Open / turn off the dialog box from cancel (in form while editing)
    const toSetDialogBoxOn = () => {
        setDialogBoxOn(true);
    };
        
    const toSetDialogBoxOff = () => {
        setDialogBoxOn(false);
    };

    // Called when pressing 'exit anyway' on dialog box after pressing x
    const exitDialogWithX = () => {
        setExitWithCancelOn(false);
        setModalOn(!modalOn);
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
    }

    // Called when pressing 'exit anyway' on dialog box after pressing cancel
    const exitDialogWithCancel = () => {
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
        setExitWithCancelOn(false);
    }

    // Turns off creation, deletion & error snackbar alert
    const toSetSuccessSnackbarOff = () => {
        setSuccessSnackbarOn(false);
    };

    const toSetErrorSnackbarOff = () => {
        setErrorSnackbarOn(false);
    };

    const toSetDeleteSnackbarOff = () => {
        setDeleteSnackbarOn(false);
    };

    const createAccount = (cleanFormValues) =>{
        const db = getDatabase();
        const postListRef = ref(db, user.uid + '/accounts');
        const newPostRef = push(postListRef);
        set(newPostRef, {
            ...cleanFormValues
        })
        .then(() => {
            setSuccessSnackbarOn(true);
        })
        .catch((error) => {
            console.log(error);
            setErrorSnackbarOn(true, error);
        })
        setEditOn(false);
    };

    const deleteAccount = (accountToDelete, index, editOnTrue) => {
        const idToDel = accountToDelete.id;
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if(childData.id === idToDel){
                    let newAccounts = allAccounts;
                    newAccounts.splice(index, 1);
                    setAllAccounts(newAccounts);
                    remove(ref(db, user.uid + `/accounts/${childKey}`))
                    .then(() => {
                        if(!editOnTrue){
                            setDeleteSnackbarOn(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setErrorSnackbarOn(true, error);
                    })
                }
            })
        },
        {onlyOnce: true});
    };

    return (
        <section className="w-full order-1 xl:col-span-3 xl:row-span-12 xl:w-full xl:h-full">
            <div className="bg-slate-50 rounded-sm p-3 m-3 flex flex-col gap-2 h-80 sm:w-10/12 sm:m-auto md:w-9/12 xl:w-full xl:h-full dark:bg-indigo-900">
                <header className="flex justify-between">
                    <h2 className="text-indigo-900 font-bold text-xl dark:text-indigo-300">
                        Accounts
                    </h2>
                    <Button sx={props.buttonStyles} aria-expanded={modalOn ? 'true' : 'false'} onClick={() => toSetModalOn()} variant='contained' tabIndex={props.showNav || modalOn ? -1 : 0}>
                        Manage Accounts
                    </Button>
                </header>
                <Accounts
                    allAccounts={allAccounts}
                    toSetAllAccounts={toSetAllAccounts}
                    darkMode={props.darkMode}/>
            </div>
            { modalOn && 
            <div className='absolute bg-gray-950/75 w-full h-screen z-50 top-0 p-3 flex flex-col justify-center items-center xl:inset-x-0'>
                <DeleteSnackbar
                    message='Account deleted'
                    deleteSnackbarOn={deleteSnackbarOn}
                    toSetDeleteSnackbarOff={toSetDeleteSnackbarOff}/>
                <ErrorSnackbar
                    message='Error creating account'
                    errorSnackbarOn={errorSnackbarOn}
                    toSetErrorSnackbarOff={toSetErrorSnackbarOff}/>
                <SuccessSnackbar 
                    message='Account created!'
                    successSnackbarOn={successSnackbarOn} 
                    toSetSuccessSnackbarOff={toSetSuccessSnackbarOff}/>
                <EditDialogBox 
                    buttonStyles={props.buttonStyles}
                    theme={props.theme}
                    dialogBoxOn={dialogBoxOn}
                    toSetDialogBoxOff={toSetDialogBoxOff} 
                    toSetDialogBoxOffAndClearGoal={exitWithCancelOn ? exitDialogWithCancel : exitDialogWithX} 
                    dialogTitle="Exit while editing your account?"
                    dialogText="Exiting now will cause the account you are editing to be lost."/>
                <article className='container h-4/6 w-full bg-gray-50 p-3 max-h-96 sm:m-auto sm:h-[90vh] md:w-10/12 md:max-h-[60%] xl:max-w-[50%] xl:flex xl:flex-col dark:bg-indigo-900'>
                    <header className="flex justify-between">
                        <h2 className="text-indigo-900 font-bold text-xl dark:text-indigo-300">Accounts</h2>
                        <Button sx={props.buttonStyles} onClick={() => toSetModalOff()}>
                            Exit
                        </Button>
                    </header>
                    <div className="flex gap-2 mt-2 h-5/6 justify-center sm:gap-3 xl:w-11/12 xl:m-auto xl:gap-10">
                        <Accounts
                            modalOn={modalOn}
                            allAccounts={allAccounts}
                            toSetAllAccounts={toSetAllAccounts}
                            darkMode={props.darkMode}
                            editOn={editOn}
                            editAccount={editAccount}
                            deleteAccount={deleteAccount}/>
                        <AccountsForm
                            formOn={formOn}
                            allAccounts={allAccounts}
                            toSetFormOn={toSetFormOn}
                            toSetFormOff={toSetFormOff}
                            editOn={editOn}
                            accountToEdit={accountToEdit}
                            toSetEditOn={toSetEditOn}
                            toSetEditOff={toSetEditOff}
                            toSetExitWithCancelOn={toSetExitWithCancelOn}
                            toSetDialogBoxOn={toSetDialogBoxOn}
                            createAccount={createAccount}
                            deleteAccount={deleteAccount}
                            buttonStyles={props.buttonStyles}
                            inputStyles={props.inputStyles}/>
                    </div>
                </article>
            </div>
            }
        </section>
    );
}

export default AccountsModal;