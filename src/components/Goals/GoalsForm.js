import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import validateGoal from './validateGoal';
import capitalizeName from '../capitalizeName';

function GoalsForm(props) {
    const initialValues = { name: "", current: '', total: '', id: Math.random()*1000 };
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState(null);
    const topInputBox = useRef();

    // Turns form on & ensures a blank form (edit mode off, form initalized with blank values, no form errors)
    const toSetFormOn = () =>{
        props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn();
    };

    const setFocus = () => {
        topInputBox.current.focus();
    };
    // Watches for a goal to edit & will fill the form with its values when edit mode is on
    useEffect(() => {
        if(props.goalToEdit?.name.length !== 0 && props.editOn === true){
            setFormValues(props.goalToEdit);
            setFocus();
            setFormErrors(null);
        }
    }, [props.goalToEdit]);  // eslint-disable-line

    // Handles submission of form including validating form values, resetting the form, and sending clean form values to database
    const handleSubmit = (e) =>{
        e.preventDefault();
        // capture any unacceptable answers from form input
        const errors = validateGoal(formValues);
        // if there are no errors in error object send to database and clear form & set focus to first input box
        if(Object.keys(errors).length === 0){
            props.createGoal(formValues);
            setFocus();
            toSetFormOn();
        // if there are errors add them to error state to display them
        } else {
            setFormErrors(errors);
        }
    };

    // Handles formatting input for formValues state
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'current' || name === 'total'){
            setFormValues({...formValues, [name]: value.replace(/^0+/, '').trim()});
        } else {
            setFormValues({...formValues, [name]: value});
        }
        // If there was an error on this textfield, once a change happens it'll disappear
        setFormErrors({...formErrors, [name]: null});
        // console.log(value.replace(/^0+/, ""));
    }

    // Exit form with cancel button
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
    }

    // Gives a new ID to form values on submission
    const giveId = () => {
        const newId = Math.random()*1000;
        setFormValues({...formValues, id: newId });
        capitalizeName(formValues, setFormValues);
    }

    // Goal form to render on open
    const goalForm = () => {
        return(
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-1 md:gap-5 xl:gap-3">
                <h4 className="m-atuo text-center text-indigo-900 dark:text-indigo-300 text-base font-medium">
                    {props.editOn === false ? 'Create your goal' : 'Edit your goal' }
                </h4>
                <div className="flex flex-col gap-2 sm:flex-row sm:pr-12 md:flex-col md:pr-0 md:gap-5">
                    <TextField 
                        id="filled-basic" 
                        label="Goal name" 
                        variant="filled" 
                        name="name"
                        size="small"
                        sx={{ width: {
                            xs: 150,
                            sm: 150,
                            md: 300,
                            },
                            margin:'auto'  }}
                        value={formValues.name}
                        onChange={handleChange}
                        error={formErrors?.name ? true : false}
                        helperText={formErrors?.name}
                        inputRef={topInputBox}/>
                    <div className="flex gap-2 justify-center sm:gap-10 md:gap-5 lg:gap-5">
                        <TextField 
                            id="filled-basic" 
                            label="Current amount" 
                            variant="filled"
                            size="small"
                            name="current"
                            sx={{ width: {
                                xs: 150,
                                sm: 150,
                                md: 300,
                                }}}
                            value={formValues.current}
                            onChange={handleChange}
                            error={formErrors?.current ? true : false}
                            helperText={formErrors?.current}/>
                        <TextField 
                            id="filled-basic" 
                            label="Total amount" 
                            variant="filled"
                            size="small"
                            name="total"
                            sx={{ width: {
                                xs: 150,
                                sm: 150,
                                md: 300,
                                }}}
                            value={formValues.total}
                            onChange={handleChange}
                            error={formErrors?.total  ? true : false}
                            helperText={formErrors?.total}/>
                    </div>
                </div>
                <div className="flex gap-2 justify-center pt-1 xl:pt-0">
                    <Button sx={props.buttonStyles} type="submit" onClick={() => giveId()}>
                        {props.editOn === false ? 'Create' : 'Finalize Edits' }
                    </Button>
                    <Button sx={props.buttonStyles} onClick={() => toSetFormOff()}>
                        Cancel
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <article>
            {props.formOn === true ? goalForm() : 
                <div className="w-full flex justify-center gap-2">
                    <div className="text-indigo-900 dark:text-indigo-300 font-medium">
                        Edit, Delete or
                    </div>
                    <Button sx={props.buttonStyles} onClick={() => toSetFormOn()}>
                        Create new goal +
                    </Button>
                </div>
            }
        </article>
    );
}

export default GoalsForm;