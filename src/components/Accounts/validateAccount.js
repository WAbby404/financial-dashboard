function validateAccount(values, otherAccounts) {
    const errors = {}; 

    let accountNames = [];
    Object.values(otherAccounts).forEach((account) => {
        accountNames.push(account.name);
    })
    if(accountNames.includes(values.name)){
        errors.name = 'Name must be unique'
    }
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