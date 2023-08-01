function ValidateAccounts(values) {
    // account name needs to be unqiue
    const errors = {}; 
    if(!values.name){
        errors.name = 'Account name required.';
    }
    if(values.name.length > 10){
        errors.name = 'Account name cannot exceed 10 characters.';
    }

    return errors;
}

export default ValidateAccounts;