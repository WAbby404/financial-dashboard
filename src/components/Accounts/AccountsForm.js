import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ValidateAccounts from './ValidateAccounts';

function AccountsForm(props) {
    const initialValues = { name: "", total: 0, checkingAccount: null, id:Math.random()*1000 };
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState(null);

    const accountTypes = [{label: 'Debit'},
                        {label: 'Credit'}]

    const toSetFormOn = () =>{
        // props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn();
        // console.log(props.formOn);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(formValues);
        const errors = ValidateAccounts(formValues);
        // If there are no errors, send transaction to database
        // console.log(Object.keys(errors));
        if(Object.keys(errors).length === 0){
            // console.log('transaction sent up');
            props.createAccount(formValues);
            // Reset form and show success message
            toSetFormOn();
        } else {
            setFormErrors(errors);
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({...formValues, [name]: value});
        setFormErrors({...formErrors, [name]: null});
    };

    const handleOptionChangeAccount = (event, newValue) => {
        // if there is no value set formvalue to null
        if(!newValue){
            setFormValues({...formValues, checkingAccount: null});
        // if there is a value, clear form error for category
        } else {
            // console.log(newValue);
            if( newValue.label === 'Debit' ){
                setFormValues({...formValues, checkingAccount: true});
                setFormErrors({...formErrors, checkingAccount: null});
            } else {
                setFormValues({...formValues, checkingAccount: false});
                setFormErrors({...formErrors, checkingAccount: null});
            }
            
        }
    };

    const toSetFormOff = () =>{
        // if editing a goal, prompt user with dialog box
        // if(props.editOn){
            // props.toSetDialogBoxOn();
            // when dialog box is prompted with cancel, only close form, instead of whole modal
            // props.toSetExitWithCancelOn();
        // if not editing a goal, clear form and close it
        // } else {
            setFormValues(initialValues);
            setFormErrors(null);
            // props.toSetEditOff();
            props.toSetFormOff();
        // }
    };

    const giveId = () => {
        const newId = Math.random()*1000;
        setFormValues({...formValues, id: newId });
        capitalizeFirst(formValues);
    };

    const capitalizeFirst = (formValues) => {
        const name = formValues.name;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        setFormValues({...formValues, name: capitalizedName});
    }

    const accountsForm = () => {
        return(
            <form onSubmit={handleSubmit} className="flex-center">
                <h4>
                    Create your Account
                </h4>
                <Autocomplete
                    name="checkingAccount"
                    value={formValues?.checkingAccount ? 'Debit' : 'Credit'}
                    onChange={(event, newValue) => handleOptionChangeAccount(event, newValue)}
                    disablePortal
                    id="combo-box-demo"
                    options={accountTypes}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Account Type" 
                                                name="checkingAccount" 
                                                error={formErrors?.checkingAccount ? true : false} 
                                                helperText={formErrors?.checkingAccount}/>}
                    isOptionEqualToValue={(option, value) => option.label === value}/>
                <TextField
                    id="filled-basic" 
                    label="Account name" 
                    variant="filled"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={formErrors?.name ? true : false}
                    helperText={formErrors?.name}/>
                <div>
                    <Button variant='contained' type="submit" onClick={() => giveId()}>
                        {/* {props.editOn === false ? 'Create goal' : 'Finalize Edits' } */}
                        Create Account
                    </Button>
                    <Button variant='outlined' onClick={() => toSetFormOff()}>
                        Cancel
                    </Button>
                </div>
            </form>
        )
    };

    return (
        <div>
            {props.formOn === true ? accountsForm() :
                <div className="flex">
                    <div className="goals--text">
                        Edit, Delete or
                    </div>
                    <Button variant='contained'
                        onClick={() => toSetFormOn()}>
                        Create new account +
                    </Button>
                </div>
            }
            
        </div>
    );
}

export default AccountsForm;