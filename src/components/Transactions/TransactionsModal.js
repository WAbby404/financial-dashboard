import React, { useState } from 'react';
import Transactions from './Transactions';
import TransactionsForm from'./TransactionsForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, push, set, onValue, remove, update } from "firebase/database";
import Button from '@mui/material/Button';
import EditDialogBox from '../EditDialogBox';
import SuccessSnackbar from '../SuccessSnackbar';
import ErrorSnackbar from '../ErrorSnackbar';
import DeleteSnackbar from '../DeleteSnackbar';

function TransactionsModal(props) {
    const [ user ] = useAuthState(auth);
    // Represents all transactions, read from database
    const [ allTransactions, setAllTransactions ] = useState([]);
    const [ modalOn, setModalOn ] = useState(false);
    const [ formOn, setFormOn ] = useState(false);
    // Sets edit mode on, necessary for useEffect in TransactionsForm, exiting while editing (with cancel and X) & dialog box
    const [ editOn, setEditOn ] = useState(false);
    const [ transactionToEdit, setTransactionToEdit ] = useState(null); 
    const [ successSnackbarOn, setSuccessSnackbarOn ] = useState(false);
    const [ errorSnackbarOn, setErrorSnackbarOn ] = useState(false);
    const [ deleteSnackbarOn, setDeleteSnackbarOn ] = useState(false);
    const [ dialogBoxOn, setDialogBoxOn ] = useState(false);
    const [ exitWithCancelOn, setExitWithCancelOn ] = useState(false);

    // vvv this is odd, i have an issue where if i modify an element in a state array or obj React wont push for an update, so i add 1 to a count which DOES push for an update
    // maybe i can try force update here



    const toSetFormOn = () => {
        setFormOn(true);
    };

    const toSetFormOff = () => {
        setFormOn(false);
        setExitWithCancelOn(false);
    };

    const toSetModalOn = () => {
        setModalOn(true);
        window.scroll(0, 0);
        const body = document.querySelector("body");
        body.style.overflow = "hidden";
    }

    const toSetModalOff = () => {
        setExitWithCancelOn(false);
        // alerts with dialog box while transaction is being edited
        if(editOn){
            setDialogBoxOn(true);
        } else {
            setModalOn(!modalOn);
            setFormOn(false);
            setEditOn(false);
            const body = document.querySelector("body");
            body.style.overflow = "auto";
            toSetSuccessSnackbarOff();
        }
    };

    const toSetEditOn = () => {
        setEditOn(true);
    };

    const toSetEditOff = () => {
        setEditOn(false);
    };

    // Sets which goal to edit, turn on form  & edit mode for GoalsForm useEffect
    const editTransaction = (transactionToEdit, index) => {
        setTransactionToEdit(transactionToEdit, index);
        setEditOn(true);
        setFormOn(true);
    };

    const toSetAllTransactions = (newTransactions) => {
        setAllTransactions(newTransactions);
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
        setModalOn(false);
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
        const body = document.querySelector("body");
        body.style.overflow = "auto";
    }

    // Called when pressing 'exit anyway' on dialog box after pressing cancel
    const exitDialogWithCancel = () => {
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
        setExitWithCancelOn(false);
        const body = document.querySelector("body");
        body.style.overflow = "auto";
    }

    // Turns off success snackbar alert
    const toSetSuccessSnackbarOff = () => {
        setSuccessSnackbarOn(false);
    };

    const toSetErrorSnackbarOff = () => {
        setErrorSnackbarOn(false);
    };

    const toSetDeleteSnackbarOff = () => {
        setDeleteSnackbarOn(false);
    };

    const createTransaction = (newTransaction) =>{
        const db = getDatabase();
        const dbTransactionRef = ref(db, user.uid + '/transactions');
        const newTransactionPostRef = push(dbTransactionRef);
        set(newTransactionPostRef, {
            ...newTransaction
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

    const deleteTransaction = (transacitonToDelete, index, editOnTrue) => {
        const idToDel = transacitonToDelete.id;
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/transactions');
        onValue(dbRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    if(childData.id === idToDel){
                        let newTransactions = allTransactions;
                        newTransactions.splice(index, 1);
                        setAllTransactions(newTransactions);
                        remove(ref(db, user.uid + `/transactions/${childKey}`))
                        .then(() => {
                            if(!editOnTrue){
                                setDeleteSnackbarOn(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setErrorSnackbarOn(true, error);
                        });
                    }
                })
        },{onlyOnce: true});
        reflectDeleteTransaction(transacitonToDelete);
    };

    const reflectDeleteTransaction = (formValues) => {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts/');
        let accountTotal = 0;
        let accountId = `${user.uid}/accounts/`;
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if(childData.name === formValues.account){
                    accountId += `${childSnapshot.key}`;
                    if(formValues.positive){
                        accountTotal = +childData.total - +(parseFloat(formValues.value)).toFixed(2);
                    } else {
                        accountTotal = +childData.total + +(parseFloat(formValues.value)).toFixed(2);
                    }
                }
            })
        },{onlyOnce: true});
        let updatedRef = ref(db, accountId);
        update(updatedRef, {total: accountTotal});
    }

    return (
        <section className="w-full order-2 xl:col-span-3 xl:row-span-12 xl:w-full xl:h-full xl:order-3">
            <div className="bg-slate-50 dark:bg-indigo-900 rounded-sm p-3 m-3 flex flex-col gap-2 max-h-80 sm:w-10/12 sm:m-auto md:w-9/12 xl:w-full xl:h-full xl:max-h-none">
                <header className="flex justify-between">
                    <h2 className="text-indigo-900 dark:text-indigo-300 font-bold text-xl">Transactions</h2>
                    <Button sx={props.buttonStyles} onClick={() => toSetModalOn()}>
                        Manage Transactions
                    </Button>
                </header>
                <Transactions 
                    allTransactions={allTransactions}
                    toSetAllTransactions={toSetAllTransactions}
                    darkMode={props.darkMode}/>
            </div>
            {modalOn && 
                <div className="absolute bg-gray-950/75 w-full h-screen z-50 top-0 p-3 flex flex-col justify-center items-center xl:inset-x-0">
                    <DeleteSnackbar
                        message='Transaction deleted.'
                        deleteSnackbarOn={deleteSnackbarOn}
                        toSetDeleteSnackbarOff={toSetDeleteSnackbarOff}/>
                    <ErrorSnackbar
                        message='Error with transaction.'
                        errorSnackbarOn={errorSnackbarOn}
                        toSetErrorSnackbarOff={toSetErrorSnackbarOff}/>
                    <SuccessSnackbar
                        message='Transaction created!' 
                        successSnackbarOn={successSnackbarOn} 
                        toSetSuccessSnackbarOff={toSetSuccessSnackbarOff}/>
                    <EditDialogBox 
                        dialogBoxOn={dialogBoxOn}
                        toSetDialogBoxOff={toSetDialogBoxOff}
                        toSetDialogBoxOffAndClearGoal={exitWithCancelOn ? exitDialogWithCancel : exitDialogWithX} 
                        dialogTitle="Exit while editing your transaction?"
                        dialogText="Exiting now will cause the transaction you are editing to be lost."/>
                    <article className="container h-[37rem] w-full bg-slate-50 dark:bg-indigo-900 p-3 sm:max-h-[98vh] md:w-11/12 md:max-h-[60%] lg:max-h-[85%] xl:max-w-[50%]">
                        <header className="flex justify-between">
                            <h2 className="text-indigo-900 dark:text-indigo-300 font-bold text-xl">Transactions</h2>
                            <Button onClick={() => toSetModalOff()} className="btn" size="small" sx={props.buttonStyles}>
                                X
                            </Button>
                        </header>
                        <div className="flex gap-2 mt-2 h-5/6 m-auto justify-center md:w-11/12 md:gap-3 xl:gap-10">
                            <Transactions
                                modalOn={modalOn}
                                toSetAllTransactions={toSetAllTransactions}
                                allTransactions={allTransactions}
                                deleteTransaction={deleteTransaction}
                                editOn={editOn}
                                editTransaction={editTransaction}
                                darkMode={props.darkMode}/>
                            <TransactionsForm 
                                formOn={formOn}
                                toSetFormOn={toSetFormOn}
                                toSetFormOff={toSetFormOff}
                                editOn={editOn}
                                transactionToEdit={transactionToEdit}
                                toSetEditOn={toSetEditOn}
                                toSetEditOff={toSetEditOff}
                                toSetExitWithCancelOn={toSetExitWithCancelOn}
                                toSetDialogBoxOn={toSetDialogBoxOn}
                                createTransaction={createTransaction}
                                deleteTransaction={deleteTransaction}
                                buttonStyles={props.buttonStyles}
                                inputStyles={props.inputStyles}
                                theme={props.theme}/>
                        </div>
                    </article>
                </div>
            }
        </section>
    );
}

export default TransactionsModal;