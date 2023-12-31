import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import validateTransaction from './validateTransaction';
import capitalizeName from '../capitalizeName';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';

function TransactionsForm(props) {
    const initialValues = { name: "", account: null, category: null, date: "", positive: false, value: "", id: Math.random()*1000 };
    const initialCategories = [
        {label: 'Personal', showInSpending: true},
        {label: 'Housing', showInSpending: true},
        {label: 'Health', showInSpending: true},
        {label: 'Transportation', showInSpending: true},
        {label: 'Entertainment', showInSpending: true},
        {label: 'Food', showInSpending: true},
        {label: 'Money In', showInSpending: false},
        {label: 'Transfer', showInSpending: false},
        {label: 'Credit Card Payment', showInSpending: false},
    ];
    const [ user ] = useAuthState(auth);
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ categories, setCategories ] = useState(initialCategories);
    const [ allAccounts, setAllAccounts ] = useState([]);
    const [ creditCardTotal, setCreditCardTotal ] = useState(null);
    const topInputBox = useRef();

    const toSetFormOn = setModeTo =>{
        props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn(setModeTo);
    };

    useEffect(() => {
        if(props.transactionToEdit?.name.length !== 0 && props.editOn === true){
            setFormValues(props.transactionToEdit);
            setFormErrors(null);
        }
    }, [props.transactionToEdit]);  // eslint-disable-line


    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateTransaction(formValues, creditCardTotal);
        if(Object.keys(errors).length === 0){
            props.createTransaction(formValues);
            // Reset form and show success message
            toSetFormOn();
            reflectTransactionInAccounts(formValues);
        } else {
            setFormErrors(errors);
        }
    };

    // when a transaction is made, its value will be reflected in its corresponding account
    const reflectTransactionInAccounts = (formValues) => {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts/');
        let accountTotal = 0;
        let accountId = `${user.uid}/accounts/`;
        let transferToTotal = 0;
        let transferToId = `${user.uid}/accounts/`;
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if (childData.name === formValues.account){
                    accountId += `${childSnapshot.key}`;
                    if(formValues.positive){
                        // unary operator (+ infront of childData.total & formValues.value) convert strings to numbers to add them together
                        accountTotal = +childData.total + +(parseFloat(formValues.value)).toFixed(2);
                    } else {
                        accountTotal = +childData.total - +(parseFloat(formValues.value)).toFixed(2);
                    }
                }
                // if transaction has transferTo value, then add the transactions value to the corresponding transferTo account
                if(formValues.transferTo){
                    if(childData.name === formValues.transferTo){
                        transferToId += `${childSnapshot.key}`;
                        transferToTotal = +childData.total + +(parseFloat(formValues.value)).toFixed(2);
                        let transferUpdatedRef = ref(db, transferToId);
                        update(transferUpdatedRef, {total: transferToTotal.toFixed(2)});
                    }
                }
        })
        },{onlyOnce: true});
        let updatedRef = ref(db, accountId);
        update(updatedRef, {total: accountTotal.toFixed(2)});
    }

    // handles change for inputs from form
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'positive' && value === 'true'){
            setFormValues({...formValues, positive: true});
        } else if (name === 'positive' && value === 'false'){
            setFormValues({...formValues, positive: false});
        } else if (name === 'value' || name === 'date'){
            let values = value.split('.');
            if(values[1] && values[1].length > 2){
                return;
            }
            setFormValues({...formValues, [name]: value.replace(/^0+/, '').trim()});
        } else {
            setFormValues({...formValues, [name]: value});
        }
        setFormErrors({...formErrors, [name]: null});
    }

    // Exit form with cancel button
    const toSetFormOff = () =>{
        // if editing a transaction, prompt user with dialog box
        if(props.editOn){
            props.toSetDialogBoxOn();
            props.toSetExitWithCancelOn();
        // if not editing a transaction, clear form and close it
        } else {
            setFormValues(initialValues);
            setFormErrors(null);
            props.toSetEditOff();
            props.toSetFormOff();
        }
    }

    // this is for transactions when they are submitted
    const giveId = () => {
        setFormValues({...formValues, id: Math.random()*1000});
        capitalizeName(formValues, setFormValues);
    }

    // for the drop down menu on transferTo input, filters out current selected account
    // (so you cant transfer to the same account)
    const setTransferToAccounts = () => {
        const currentAccount = formValues?.account;
        let transferToAccounts = allAccounts.filter((account) => (account.label !== currentAccount && account.debit));
        return transferToAccounts;
    }

    // will change positive T/F depending on which category is selected
    // categories like money in will be positive, expenses will be negative including CC payments
    const handleOptionChangeCategory = (event, newValue) => {
        // if there is no value set formvalue to null
        if(!newValue){
            setFormValues({...formValues, category: null});
            setCreditCardTotal(null);
        // if there is a value, clear form error for category
        } else {
            setFormErrors({...formErrors, category: null});
            if(newValue.label === 'Money In'){
                setCreditCardTotal(null);
                setFormValues({...formValues, positive: true, category: newValue.label });
            } else if (newValue.label === 'Credit Card Payment'){
                setFormValues({...formValues, positive: true, category: newValue.label });
                // take the payment amount out of corresponding credit account
                const db = getDatabase();
                const dbRef = ref(db, user.uid + '/accounts');
                onValue(dbRef, (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        console.log(childData);
                        if(childData.name === formValues.account){
                            setCreditCardTotal(childData.total);
                        }
                })});
            } else if (newValue.label === 'Transfer') {
                setCreditCardTotal(null);
                setFormValues({...formValues, positive: false, category: newValue.label, transferTo: null });
            } else {
                setCreditCardTotal(null);
                setFormValues({...formValues, positive: false, category: newValue.label });
            }
        }
    }

    // for category drop down input, filters out categories based on type of account (debit or credit)
    const handleOptionChangeAccount = (event, newValue) => {
        // if there is no value set formvalue to null
        if(!newValue){
            setFormValues({...formValues, account: null});
        // if there is a value, clear form error for category
        } else {
            setFormValues({...formValues, account: newValue.label, category:null});
            setFormErrors({...formErrors, account: null});
            // Conditional for which categories are enabled when certain accounts are selected
            if(newValue.debit){
                let newCategories = categories.filter((category) => category.label !== 'Credit Card Payment');
                if(!newCategories.some((category) => category.label === 'Transfer')){
                    newCategories.push({label: 'Transfer', showInSpending: false});
                }
                if(!newCategories.some((category) => category.label === 'Money In')){
                    newCategories.push({label: 'Money In', showInSpending: false});
                }
                setCategories(newCategories);
            } else if (!newValue.debit){
                let newCategories = categories.filter((category) => category.label !== 'Transfer' && category.label !== 'Money In');
                if(!newCategories.some((category) => category.label === 'Credit Card Payment')){
                    newCategories.push({label: 'Credit Card Payment', showInSpending: false});
                }
                setCategories(newCategories);
            }
        }
    }

    // removes or adds transferTo category
    const handleOptionChangeTransferTo = (event, newValue) => {
        if(!newValue){
            setFormValues({...formValues, transferTo: ''});
        } else { 
            setFormValues({...formValues, transferTo: newValue.label});
            setFormErrors({...formErrors, transferTo: null});
        }
    };

    const renderAccounts = () => {
        let formattedAccounts = [];
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/accounts');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if(!childData.id){
                    let values = Object.values(childData);
                    values.forEach((account) => {
                        formattedAccounts.push({ label:account.name, debit:account.debit });
                    })
                } else {
                    formattedAccounts.push({ label:childData.name, debit:childData.debit });
                }
            })}
            ,{onlyOnce: true}
            );
        setAllAccounts(formattedAccounts);
    }

    const transactionForm = () => {
        return(
            <div className='flex flex-col justify-center md:gap-3'>
                <h4 className="text-indigo-900 dark:text-indigo-300 font-medium sm:text-base xl:text-lg">
                    {props.editOn === false ? 'Create your transaction' : 'Edit your transaction'}
                </h4>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-0.5 md:flex md:flex-col md:justify-center md:m-auto md:gap-3">
                        <TextField
                            id="filled-basic"
                            label="Title"
                            variant="outlined"
                            size="small"
                            data-testid="transactionsFormTitle"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            error={formErrors?.name ? true : false}
                            helperText={formErrors?.name}
                            sx={props.inputStyles}
                            inputRef={topInputBox}/>
                        <Autocomplete
                            name="account"
                            value={formValues?.account}
                            onChange={(event, newValue) => handleOptionChangeAccount(event, newValue)}
                            disablePortal
                            data-testid="transactionsFormAccount"
                            id="combo-box-demo"
                            size="small"
                            options={allAccounts}
                            sx={props.inputStyles}
                            renderInput={(params) => <TextField {...params} label="Account"
                                                        name="account"
                                                        error={formErrors?.account ? true : false}
                                                        helperText={formErrors?.account}
                                        />}
                            isOptionEqualToValue={(option, value) => option.label === value}/>
                        <Autocomplete
                            name="category"
                            value={formValues?.category}
                            onChange={(event, newValue) => handleOptionChangeCategory(event, newValue)}
                            disablePortal
                            size="small"
                            data-testid="transactionsFormCategory"
                            disabled={formValues?.account ? false : true}
                            id="combo-box-demo"
                            options={categories}
                            sx={props.inputStyles}
                            renderInput={(params) => <TextField {...params} label="Category"
                                                        name="category"
                                                        error={formErrors?.category ? true : false}
                                                        helperText={formErrors?.category}
                                        />}
                            isOptionEqualToValue={(option, value) => option.label === value}/>
                        {formValues?.category === 'Transfer' ?
                            <Autocomplete
                                name="transferTo"
                                value={formValues?.transferTo}
                                onChange={(event, newValue) => handleOptionChangeTransferTo(event, newValue)}
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                data-testid="transactionsFormTransfer"
                                options={setTransferToAccounts()}
                                sx={props.inputStyles}
                                renderInput={(params) => <TextField {...params} label="Transfer To"
                                                            name="category"
                                                            error={formErrors?.transferTo ? true : false}
                                                            helperText={formErrors?.transferTo}
                                            />}
                                isOptionEqualToValue={(option, value) => {
                                    return option.label === value;
                                }}/>
                        : ''}
                        <div className="flex items-center m-auto max-w-[150px] md:max-w-[300px]">
                            <div className="text-indigo-900 dark:text-indigo-300">{formValues?.positive ? <AddIcon/> : <RemoveIcon/> }</div>
                            <TextField
                                id="filled-basic"
                                label="Value"
                                variant="outlined"
                                name="value"
                                size="small"
                                data-testid="transactionsFormValue"
                                type="number"
                                disabled={formValues?.category ? false : true}
                                value={formValues.value}
                                onChange={handleChange}
                                sx={props.inputStyles}
                                error={formErrors?.value ? true : false}
                                helperText={formErrors?.value}
                                />
                        </div>
                        <TextField
                            id="filled-basic"
                            label="Day of month"
                            variant="outlined"
                            size="small"
                            name="date"
                            data-testid="transactionsFormDate"
                            disabled={formValues?.category ? false : true}
                            value={formValues.date}
                            onChange={handleChange}
                            sx={props.inputStyles}
                            error={formErrors?.date ? true : false}
                            helperText={formErrors?.date}/>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 justify-center sm:flex-row sm:w-full sm:flex-auto sm:pt-0 md:gap-3">
                        <Button sx={props.buttonStyles} 
                            type="submit" 
                            size="small" 
                            onClick={() => giveId()}
                            data-testid="transactionsFormSubmit">
                            {props.editOn === false ? 'Create' : 'Finalize' }
                        </Button>
                        <Button 
                            sx={props.buttonStyles} 
                            size="small" 
                            onClick={() => toSetFormOff()}
                            data-testid="transactionsFormClose">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <article className="basis-40 sm:basis-7/12 md:basis-1/2">
            {props.formOn === true ? transactionForm() :
                <div className="flex flex-col">
                    <div className="text-indigo-900 dark:text-indigo-300 text-center font-medium">
                        Edit, Delete or
                    </div>
                    <Button sx={props.buttonStyles}
                        data-testid='transactionsFormOpen'
                        onClick={() => {
                            renderAccounts();
                            toSetFormOn(true);
                        }}>Create new transaction</Button>
                </div>
            }
        </article>
    );
}

export default TransactionsForm;