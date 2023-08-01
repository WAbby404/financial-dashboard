import React, { useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ValidateTransaction from './ValidateTransaction';

function TransactionsForm(props) {
    const initialValues = { name: "", account: null, category: null, date: "", positive: false, value: "", id: Math.random()*1000 };
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const categories = [
        {label: 'Groceries', showInSpending: true},
        {label: 'Credit Card Payment', showInSpending: false},
        {label: 'Entertainment', showInSpending: true},
        {label: 'Profit', showInSpending: false},
        {label: 'Living Expense', showInSpending: true},
        {label: 'Eating Out', showInSpending: true},
        {label: 'Miscellanious', showInSpending: true},
    ];
    const accounts = [
        {label: 'Checking', total: 250},
        {label: 'Savings', total: 250},
        {label: 'Credit Cards', total: 250},
    ]

    const toSetFormOn = setModeTo =>{
        props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn(setModeTo);
    };

    const toSetEditOn = value => {
        props.toSetEditOn(value);
    };

    useEffect(() => {
        if(props.transactionToEdit?.name.length !== 0 && props.editOn === true){
            setFormValues(props.transactionToEdit);
        }
    }, [props.transactionToEdit]);


    const handleSubmit = (e) => {
        // if credit card, & positive then category is credit card payment
        // console.log(formValues);
        // console.log(formErrors);
        e.preventDefault();
        const errors = ValidateTransaction(formValues);
        // If there are no errors, send transaction to database
        // console.log(Object.keys(errors));
        if(Object.keys(errors).length === 0){
            // console.log('transaction sent up');
            props.createTransaction(formValues);
            // Reset form and show success message
            toSetFormOn();
        } else {
            setFormErrors(errors);
        }
    };

    const handleChange = (e) => {
        // console.log(e);
        // console.log(e.target);
        const { name, value } = e.target;
        // console.log(name);
        // console.log(value);
        setFormValues({...formValues, [name]: value});
        setFormErrors({...formErrors, [name]: null});
        if(name === 'positive' && value === 'true'){
            setFormValues({...formValues, positive: true});
        } else if (name === 'positive' && value === 'false'){
            setFormValues({...formValues, positive: false});
        }
        // console.log(formValues);
    }

    // Exit form with cancel button
    const toSetFormOff = () =>{
        // if editing a transaction, prompt user with dialog box
        if(props.editOn){
            props.toSetDialogBoxOn();
            // when dialog box is prompted with cancel, only close form, instead of whole modal
            props.toSetExitWithCancelOn();
        // if not editing a transaction, clear form and close it
        } else {
            setFormValues(initialValues);
            setFormErrors(null);
            props.toSetEditOff();
            props.toSetFormOff();
        }
    }

    const giveId = () => {
        setFormValues({...formValues, id: Math.random()*1000});
    }

    const handleOptionChangeCategory = (event, newValue) => {
        // if there is no value set formvalue to null
        if(!newValue){
            setFormValues({...formValues, category: null});
        // if there is a value, clear form error for category
        } else {
            setFormValues({...formValues, category: newValue.label});
            setFormErrors({...formErrors, category: null});
        }
    }

    const handleOptionChangeAccount = (event, newValue) => {
        // if there is no value set formvalue to null
        if(!newValue){
            setFormValues({...formValues, account: null});
        // if there is a value, clear form error for category
        } else {
            setFormValues({...formValues, account: newValue.label});
            setFormErrors({...formErrors, account: null});
        }
    }

    const transactionForm = () => {
        return(
            <form onSubmit={handleSubmit} className="flex-stack">
                <h4 className="goal__title">{props.editOn === false ? 'Create your transaction' : 'Edit your transaction' }</h4>
                <Autocomplete
                    name="account"
                    value={formValues?.account}
                    onChange={(event, newValue) => handleOptionChangeAccount(event, newValue)}
                    disablePortal
                    id="combo-box-demo"
                    options={accounts}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Account" 
                                                name="account" 
                                                error={formErrors?.account ? true : false} 
                                                helperText={formErrors?.account}/>}
                    isOptionEqualToValue={(option, value) => option.label === value}/>
                    <Autocomplete
                    name="category"
                    value={formValues?.category}
                    onChange={(event, newValue) => handleOptionChangeCategory(event, newValue)}
                    disablePortal
                    id="combo-box-demo"
                    options={categories}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Category" 
                                                name="category" 
                                                error={formErrors?.category ? true : false} 
                                                helperText={formErrors?.category}
                                />}
                    isOptionEqualToValue={(option, value) => option.label === value}/>
                <div className="flex">
                    <ToggleButtonGroup
                        orientation="vertical"
                        value={formValues?.positive}
                        exclusive
                        onChange={handleChange}>
                        <ToggleButton value={true} aria-label="list" name='positive' size="small">
                            +
                        </ToggleButton>
                        <ToggleButton value={false} aria-label="list" name='positive' size="small">
                            -
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                        id="filled-basic"
                        label="Value"
                        variant="filled"
                        name="value"
                        value={formValues.value}
                        onChange={handleChange}
                        error={formErrors?.value ? true : false}
                        helperText={formErrors?.value}/>
                </div>
                <TextField
                    id="filled-basic"
                    label="Day of month"
                    variant="filled"
                    name="date"
                    value={formValues.date}
                    onChange={handleChange}
                    error={formErrors?.date ? true : false}
                    helperText={formErrors?.date}/>
                <TextField
                    id="filled-basic" 
                    label="Transaction name" 
                    variant="filled"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={formErrors?.name ? true : false}
                    helperText={formErrors?.name}/>
                    <div className="flex">
                        <Button variant='contained' type="submit" onClick={() => giveId()}>
                        {props.editOn === false ? 'Create transaction' : 'Finalize Edits' }
                        </Button>
                        <Button variant='outlined' onClick={() => toSetFormOff()}>
                            Cancel
                        </Button>
                    </div>
                </form>
        )
    }



    return (
        <div>
            {props.formOn === true ? transactionForm() :
                <div className="flex">
                    <div className="goals--text">
                        Edit, Delete or
                    </div>
                    <Button variant='contained'
                        onClick={() => toSetFormOn(true)}>Create new transaction</Button>
                </div>
            }
        </div>
    );
}

export default TransactionsForm;