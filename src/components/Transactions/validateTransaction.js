function validateTransaction(values) {
    const errors = {};

    if(!values.name){
        errors.name = 'Title required.';
    }
    if(values.name.length > 10){
        errors.name = 'Title cannot exceed 10 characters.';
    }

    if(!values.account){
        errors.account = 'Account required.';
    }

    if(!values.category){
        errors.category = 'Category required.';
    }

    if( isNaN(values.date) || values.date < 1 || values.date > 30){
        errors.date = 'Date must be a number between 1 and 30.';
    }
    if(!values.date){
        errors.date = 'Date required.';
    }


    if( isNaN(values.value) || values.value < 0.01 || values.value > 1000000){
        errors.value = 'Value must be a number between 0.01 and 1,000,000.00.';
    }
    if(!values.value){
        errors.value = 'Value required.';
    }

    if(values.category === 'Transfer' && typeof values.transferTo === 'object'){
        errors.transferTo = 'Account required.';
    }
    return errors;

}

export default validateTransaction;