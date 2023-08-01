function ValidateTransaction(values) {
    const errors = {};

    if(!values.name){
        errors.name = 'Transaction name required.';
    }
    if(values.name.length > 10){
        errors.name = 'Transaction name cannot exceed 10 characters.';
    }

    if(!values.account){
        errors.account = 'Transaction account required.';
    }

    if(!values.category){
        errors.category = 'Transaction category required.';
    }

    if( isNaN(values.date) || values.date < 1 || values.date > 30){
        errors.date = 'Date must be a number between 1 and 30.';
    }
    if(!values.date){
        errors.date = 'Transaction date required.';
    }


    if( isNaN(values.value) || values.value < 0.01 || values.value > 1000000){
        errors.value = 'Value must be a number between 0.01 and 1,000,000.00.';
    }
    if(!values.value){
        errors.value = 'Transaction value required.';
    }
    return errors;
}

export default ValidateTransaction;