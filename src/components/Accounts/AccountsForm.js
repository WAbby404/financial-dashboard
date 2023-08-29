import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import validateAccounts from './validateAccounts';
import capitalizeName from '../capitalizeName';

function AccountsForm(props) {
    const initialValues = { name: "", total: 0, debit: undefined, id:Math.random()*1000 };
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState(null);
    // const [ uniqueAccountNames, setUniqueAccountNames ] = useState(['Checking', 'Credit Card', 'Savings']);
    const topInputBox = useRef();

    const accountTypes = [{label: 'Debit'},
                        {label: 'Credit'}]

    const toSetFormOn = () =>{
        props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn();
    };

    useEffect(() => {
        if(props.accountToEdit?.name.length !== 0 && props.editOn === true){
            setFormValues(props.accountToEdit);
            // setFocus();
        }
    }, [props.accountToEdit]);  // eslint-disable-line

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formValues);
        // console.log(uniqueAccountNames);
        const errors = validateAccounts(formValues);
        // If there are no errors, send transaction to database
        if(Object.keys(errors).length === 0){
            // let oldNames = uniqueAccountNames;
            // setUniqueAccountNames(oldNames.push(formValues.name));
            props.createAccount(formValues);
            // console.log(uniqueAccountNames);
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
            setFormValues({...formValues, debit: null});
        // if there is a value, clear form error for category
        } else {
            if( newValue.label === 'Debit' ){
                setFormValues({...formValues, debit: true});
                setFormErrors({...formErrors, debit: null});
            } else {
                setFormValues({...formValues, debit: false});
                setFormErrors({...formErrors, debit: null});
            }
            
        }
    };

    const toSetFormOff = () =>{
        // if editing a goal, prompt user with dialog box
        if(props.editOn){
            props.toSetDialogBoxOn();
            // when dialog box is prompted with cancel, only close form, instead of whole modal
            props.toSetExitWithCancelOn();
        // if not editing a goal, clear form and close it
        } else {
            setFormValues(initialValues);
            setFormErrors(null);
            props.toSetEditOff();
            props.toSetFormOff();
        }
    };

    const giveId = () => {
        const newId = Math.random()*1000;
        setFormValues({...formValues, id: newId });
        capitalizeName(formValues, setFormValues);
    };


    const accountsForm = () => {
        return(
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-1 md:gap-4">
                <h3 className="text-indigo-300 font-medium">
                    Create your Account
                </h3>
                <TextField
                    id="filled-basic" 
                    label="Account name" 
                    variant="filled"
                    sx={{ width: {
                        xs: 150,
                        sm: 150,
                        md: 300,
                        },
                        margin:'auto'  }}
                    size="small"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={formErrors?.name ? true : false}
                    helperText={formErrors?.name}
                    inputRef={topInputBox}/>
                <Autocomplete
                    name="debit"
                    value={ formValues?.debit === undefined ? null : (formValues?.debit ? 'Debit' : 'Credit') }
                    onChange={(event, newValue) => handleOptionChangeAccount(event, newValue)}
                    disablePortal
                    sx={{ width: {
                        xs: 150,
                        sm: 150,
                        md: 300,
                        },
                        margin:'auto'  }}
                    size="small"
                    id="combo-box-demo"
                    options={accountTypes}
                    renderInput={(params) => <TextField {...params} label="Account Type" 
                                                name="debit" 
                                                error={formErrors?.debit ? true : false} 
                                                helperText={formErrors?.debit}/>}
                    isOptionEqualToValue={(option, value) => option.label === value}/>
                <div className="flex flex-col justify-center gap-2 sm:flex-row md:flex-col md:gap-4 md:w-3/5 md:m-auto xl:flex-row">
                    <Button sx={props.buttonStyles} type="submit" onClick={() => giveId()}>
                        {/* {props.editOn === false ? 'Create goal' : 'Finalize Edits' } */}
                        Create
                    </Button>
                    <Button sx={props.buttonStyles} onClick={() => toSetFormOff()}>
                        Cancel
                    </Button>
                </div>
            </form>
        )
    };

    return (
        <article className="basis-1/2">
            {props.formOn === true ? accountsForm() :
                <header className="flex flex-col text-center m-auto">
                    <h3 className="text-indigo-300 font-medium">
                        Edit, Delete or
                    </h3>
                    <Button sx={props.buttonStyles} 
                        onClick={() => toSetFormOn()}>
                        Create new account +
                    </Button>
                </header>
            }
            
        </article>
    );
}

export default AccountsForm;