function ValidateGoal(values) {
    const errors = {}; 
    if(!values.name){
        errors.name = 'Goal name required.';
    }
    if(values.name.length > 10){
        errors.name = 'Goal name cannot exceed 10 characters.';
    }


    if(isNaN(values.total)){
        errors.total = 'Goal total must be a number.';
    }
    if(values.total[0] === '0'){
        errors.total = 'Goal total cannot start with a 0.';
    }
    if(values.total <= 0){
        errors.total = 'Goal total must be a positive value';
    }
    if(!values.total){
        errors.total = 'Goal total amount required.';
    }


    if(isNaN(values.current)){
        errors.current = 'Goal current total must be a number.';
    }
    if(parseInt(values.current) > parseInt(values.total)){
        errors.current = 'Current total cannot be lower than total';
        errors.total = 'Current total cannot be lower than total';
    }
    if(!values.current){
        errors.current = 'Current goal amount required.';
    }

    // console.log(errors);
    return errors;
}

export default ValidateGoal;
