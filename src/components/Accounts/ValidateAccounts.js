function validateAccounts(values) {
    // account name needs to be unqiue
    const errors = {}; 
    if(!values.name){
        errors.name = 'Name required.';
    }
    if(values.name.length > 10){
        errors.name = 'Name cannot exceed 10 characters.';
    }
    // if(uniqueAccountNames.includes(values.name)){
    //     errors.name = 'Account name must be unique.'
    // }

    if(values.debit === undefined){
        errors.debit = 'Type required.';
    }
    return errors;
}

export default validateAccounts;