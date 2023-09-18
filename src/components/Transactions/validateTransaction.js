function validateTransaction(values) {
    let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let currentMonth = monthDays[new Date().getMonth()];

    const errors = {};

    if(!values.name || values.name.trim().length === 0){
        errors.name = 'Title required';
    }
    if(values.name.length > 12){
        errors.name = 'Title cannot exceed 12 characters';
    }

    if(!values.account){
        errors.account = 'Account required';
    }

    if(!values.category){
        errors.category = 'Category required';
    }

    if( isNaN(values.date) || values.date < 1 || values.date > currentMonth || values.date % 1 === '1'){
        errors.date = `Date must be a whole number between 1 and ${currentMonth}`;
    }
    if(!values.date){
        errors.date = 'Date required';
    }


    if( values.value > 9999999.99){
        errors.value = 'Value cannot exceed $9,999,999.99';
    }
    if(isNaN(values.value)){
        errors.value = "Value must be a number";
    }
    if(!values.value){
        errors.value = 'Value required';
    }
    if(values.value <= 0){
        errors.value = 'Value must be positive';
    }

    if(values.category === 'Transfer' && typeof values.transferTo === 'object'){
        errors.transferTo = 'Account required';
    }
    return errors;

}

export default validateTransaction;