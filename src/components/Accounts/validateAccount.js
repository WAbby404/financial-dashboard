function validateAccount(values) {
    // account name needs to be unqiue
    const errors = {}; 
    console.log(values.name);
    console.log(values.name.trim().length);
    console.log(values.name.length);
    if(!values.name || values.name.trim().length === 0){
        errors.name = 'Name required';
    }
    if(values.name.length > 12){
        errors.name = 'Name cannot exceed 12 characters';
    }

    if(values.debit === undefined){
        errors.debit = 'Type required';
    }
    return errors;
}

export default validateAccount;