import React, { useEffect, useState } from 'react';
import Transactions from './Transactions';
import './Transactions.css';

function TransactionsModal() {
    const [formStatus, setFormStatus] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

    const initialValues = { name: "", category: 'Groceries', date: "", positive: false, value: "", reoccuring: false, id:1 };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [newTransaction, setNewTransaction] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const categories = ['Groceries', 'Entertainment', 'Goals', 'Rent'];
    // Make this come in from props soon

    // Handles incoming inputs from form, buttons or inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({...formValues, [name]: value});
    }
    const handleClick = (name, value) => {
        setFormValues({...formValues, [name] : value})
    }

    const giveId = () => {
        setFormValues({...formValues, id: Math.random()*1000});
    }

    // Validates inputs
    const validate = (values) => {
        const errors = {};

        // Name
        if(!values.name){
            errors.name = 'Transaction name required.';
        }
        if(values.name.length > 10){
            errors.name = 'Transaction name cannot exceed 10 characters.';
        }
        // Date
        if( isNaN(values.date) || values.date < 1 || values.date > 30){
            errors.date = 'Date must be a number between 1 and 30.';
        }
        if(!values.date){
            errors.date = 'Transaction date required.';
        }

        // Values
        if( isNaN(values.value) || values.value < 0.01 || values.value > 1000000){
            errors.value = 'Value must be a number between 0.01 and 1,000,000.00.';
        }
        if(!values.value){
            errors.value = 'Transaction value required.';
        }

        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // check for errors
        const errors = validate(formValues);
        setFormErrors(errors);

        // if there are no errors, add new transaction to newTransaction state and send to Transactions component, then reset form, form errors, and initalvalues, set form disabled and show success message
        if(Object.keys(errors).length === 0){
            setNewTransaction(formValues);
            setSubmitSuccess(true);
            // resetting form
            setFormValues(initialValues);
            setFormErrors({});
        }
    }

    // make success message disappear after 10 seconds
    useEffect(() => {
        if(submitSuccess === true){
            const timeoutID = setTimeout(() => {
                setSubmitSuccess(false);
              }, "10000")
              return () => {
                // 👇️ clear timeout when component unmounts
                clearTimeout(timeoutID);
              };
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSuccess]);

    return (
        <div className="transactionsModal">
            TransactionsModal
            <Transactions newTransaction={newTransaction} deleteMode={deleteMode}/>
            <button onClick={ () => {setFormStatus(!formStatus);
                                     setDisableForm(true);
                                     setDeleteMode(false);}}>
                {formStatus ? 'Exit Manage Transactions' : 'Manage Transactions'}
            </button>
            {formStatus && 
                <div>
                    <button onClick={() => {
                        setDisableForm(false);
                        setSubmitSuccess(false);
                        setDeleteMode(false);
                    }}>Add</button>

                    <button onClick={() => {
                        setDisableForm(true);
                        setDeleteMode(false);
                    }}>Edit</button>

                    <button onClick={() => {
                        setDisableForm(true);
                        setDeleteMode(true);
                    }}>Delete</button>
                    <form onSubmit={handleSubmit}>
                        <fieldset disabled={ disableForm ?? 'disabled'}>
                            <label>Name:
                                <input 
                                    type="text"    
                                    name="name" 
                                    placeholder="ex. Clothes" 
                                    value={formValues.name}
                                    onChange={handleChange}></input>
                            </label>
                            <p>{formErrors.name}</p>
                            <br/>
                            <label>Cateogry:
                                <select
                                    name="category" 
                                    value={formValues.category} 
                                    onChange={handleChange}>
                                    {categories.map((category) => {
                                        return(
                                            <option 
                                                defaultValue
                                                value={`${category}`}
                                                key={categories.indexOf(category)}
                                                >{`${category}`}</option>
                                    )})}</select>
                            </label>
                            <br/>
                            <label>Day of the month:
                                <input 
                                    type="text" 
                                    name="date" 
                                    placeholder="ex. 11" 
                                    value={formValues.date}
                                    onChange={handleChange}></input>
                            </label>
                            <p>{formErrors.date}</p>
                            <br/>
                            <label>Value range:
                                <input
                                    disabled = {formValues.positive ?? 'disabled'}
                                    type="button"
                                    name="positive"
                                    value='+'
                                    onClick={() => handleClick('positive', true)}
                                    ></input>
                                <input
                                    disabled = {!formValues.positive ?? 'disabled'}
                                    type="button"
                                    name="negative"
                                    value= '-'
                                    onClick={() => handleClick('positive', false)}
                                    ></input>
                            </label>
                            <br/>
                            <label>Value:
                                {formValues.positive ? '+' : '-'}
                                <input 
                                    type="text" 
                                    name="value" 
                                    placeholder="ex. $1,000" 
                                    value={formValues.value}
                                    onChange={handleChange}></input>
                            </label>
                            <p>{formErrors.value}</p>
                            <br/>
                            <label>Reoccuring?
                                <div>{formValues.reoccuring ? 'yes' : 'no'}</div>
                                <input 
                                    type="button" 
                                    name="reoccuring" 
                                    value='Switch'
                                    onClick={() => handleClick('reoccuring', !formValues.reoccuring)}
                                ></input>
                            </label>
                            <br/>
                            <br/>
                            <input 
                                type="submit" 
                                name="submit" 
                                value="Submit"
                                onClick={() => giveId()}></input>
                        </fieldset>
                    </form>
                {submitSuccess ? <p>Transaction was a success!</p> : ''}
                </div>
                }
        </div>
    );
}

export default TransactionsModal;