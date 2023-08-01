import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ValidateGoal from './ValidateGoal';

function GoalsForm(props) {
    const initialValues = { name: "", current: '', total: '', id: Math.random()*1000 };
    const [ formValues, setFormValues ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState(null);

    // Turns form on & ensures a blank form (edit mode off, form initalized with blank values, no form errors)
    const toSetFormOn = () =>{
        props.toSetEditOff();
        setFormValues(initialValues);
        setFormErrors(null);
        props.toSetFormOn();
    };

    // Watches for a goal to edit & will fill the form with its values when edit mode is on
    useEffect(() => {
        if(props.goalToEdit?.name.length !== 0 && props.editOn === true){
            setFormValues(props.goalToEdit);
        }
    }, [props.goalToEdit]);

    const capitalizeFirst = (formValues) => {
        const name = formValues.name;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        setFormValues({...formValues, name: capitalizedName});
    }

    // Handles submission of form including validating form values, resetting the form, and sending clean form values to database
    const handleSubmit = (e) =>{
        e.preventDefault();
        // capture any unacceptable answers from form input
        const errors = ValidateGoal(formValues);
        // if there are no errors in error object send to database and clear form
        if(Object.keys(errors).length === 0){
            // capitalizeFirst(formValues);
            props.createGoal(formValues);
            toSetFormOn();
        // if there are errors add them to error state to display them
        } else {
            setFormErrors(errors);
        }
    };

    // Handles formatting input for formValues state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({...formValues, [name]: value});
        // If there was an error on this textfield, once a change happens it'll disappear
        setFormErrors({...formErrors, [name]: null});
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
        capitalizeFirst(formValues);
    }

    // Goal form to render on open
    const goalForm = () => {
        return(
            <form onSubmit={handleSubmit} className="flex-center">
                <h4 className="goal__title">
                    {props.editOn === false ? 'Create your goal' : 'Edit your goal' }
                </h4>
                <TextField 
                    id="filled-basic" 
                    label="Goal name" 
                    variant="filled" 
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={formErrors?.name ? true : false}
                     helperText={formErrors?.name}/>
                <div className="flex">
                    <TextField 
                        id="filled-basic" 
                        label="Current amount" 
                        variant="filled"
                        name="current"
                        value={formValues.current}
                        onChange={handleChange}
                        error={formErrors?.current ? true : false}
                        helperText={formErrors?.current}/>
                    <TextField 
                        id="filled-basic" 
                        label="Total amount" 
                        variant="filled"
                        name="total"
                        value={formValues.total}
                        onChange={handleChange}
                        error={formErrors?.total  ? true : false}
                        helperText={formErrors?.total}/>
                </div>
                <div>
                    <Button variant='contained' type="submit" onClick={() => giveId()}>
                        {props.editOn === false ? 'Create goal' : 'Finalize Edits' }
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
            {props.formOn === true ? goalForm() : 
                <div className="flex">
                    <div className="goals--text">
                        Edit, Delete or
                    </div>
                    <Button variant='contained' onClick={() => toSetFormOn()}>
                        Create new goal +
                    </Button>
                </div>
            }
        </div>
    );
}

export default GoalsForm;