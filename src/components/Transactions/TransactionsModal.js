import React, { useState } from 'react';
import Transactions from './Transactions';
import TransactionsForm from'./TransactionsForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, push, set, onValue, remove} from "firebase/database";
import Button from '@mui/material/Button';
import EditDialogBox from '../EditDialogBox';
import SuccessSnackbar from '../SuccessSnackbar';
import '../Dashboard.css';
import './Transactions.css';

function TransactionsModal(props) {
    const [ user ] = useAuthState(auth);
    // Represents all transactions, read from database
    const [ allTransactions, setAllTransactions ] = useState([]);
    const [ modalOn, setModalOn ] = useState(false);
    const [ formOn, setFormOn ] = useState(false);
    // Sets edit mode on, necessary for useEffect in TransactionsForm, exiting while editing (with cancel and X) & dialog box
    const [ editOn, setEditOn ] = useState(false);
    const [ transactionToEdit, setTransactionToEdit ] = useState(null); 
    const [ successSnackBarOn, setSuccessSnackBarOn ] = useState(false);
    const [ dialogBoxOn, setDialogBoxOn ] = useState(false);
    const [ exitWithCancelOn, setExitWithCancelOn ] = useState(false);

    // vvv this is odd, i have an issue where if i modify an element in a state array or obj React wont push for an update, so i add 1 to a count which DOES push for an update
    // maybe i can try force update here
    const [ count, setCount ] = useState(0);



    const toSetFormOn = () => {
        setFormOn(true);
    };

    const toSetFormOff = () => {
        setFormOn(false);
        setExitWithCancelOn(false);
    };

    const toSetModalOn = () => {
        setModalOn(true);
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

    // Turns off success snackbar alert
    const toSetSuccessSnackBarOff = () => {
        setSuccessSnackBarOn(false);
    };

    const createTransaction = (newTransaction) =>{
        const db = getDatabase();
        const dbTransactionRef = ref(db, user.uid + '/transactions');
        const newTransactionPostRef = push(dbTransactionRef);
        set(newTransactionPostRef, {
            ...newTransaction
        });
        setCount(count + 1);
        setEditOn(false);
        setSuccessSnackBarOn(true);
    };

    const deleteTransaction = (transacitonToDelete, index) => {
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
                        remove(ref(db, user.uid + `/transactions/${childKey}`));
                    }
                })});
        setCount(count + 1);
    };



    return (
        <div className="modal transactionsModal">
            <div className="goals__spacebetween">
                <h3 className="modal--title">Transactions</h3>
                <Button className="btn" variant='contained' onClick={() => toSetModalOn()}>
                    Manage Transactions
                </Button>
            </div>
            <Transactions 
                allTransactions={allTransactions}
                toSetAllTransactions={toSetAllTransactions}
                darkMode={props.darkMode}/>
            {modalOn && 
                <div className="overlay">
                    <SuccessSnackbar
                        message='Transaction created!' 
                        successSnackBarOn={successSnackBarOn} 
                        toSetSuccessSnackBarOff={toSetSuccessSnackBarOff}/>
                    <EditDialogBox 
                        dialogBoxOn={dialogBoxOn}
                        toSetDialogBoxOff={toSetDialogBoxOff}
                        toSetDialogBoxOffAndClearGoal={exitWithCancelOn ? exitDialogWithCancel : exitDialogWithX} 
                        dialogTitle="Exit while editing your transaction?"
                        dialogText="Exiting now will cause the transaction you are editing to be lost."/>
                    <div className="overlay__modal">
                        <div className="transactions--flex">
                            <h3 className="modal--title">Transactions</h3>
                            <Button onClick={() => toSetModalOff()} className="btn" variant='contained'>
                                X
                            </Button>
                        </div>
                        <div className="overlay--spacing">
                            <Transactions
                                modalOn={modalOn}
                                toSetAllTransactions={toSetAllTransactions}
                                allTransactions={allTransactions}
                                deleteTransaction={deleteTransaction}
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
                                deleteTransaction={deleteTransaction}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default TransactionsModal;