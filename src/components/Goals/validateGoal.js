function validateGoal(values) {
    const errors = {}; 
    if(!values.name){
        errors.name = 'Name required.';
    }
    if(values.name.length > 15){
        errors.name = 'Name cannot exceed 15 characters.';
    }


    if(isNaN(values.total)){
        errors.total = 'Total must be a number.';
    }
    if(values.total[0] === '0'){
        errors.total = 'Total cannot start with a 0.';
    }
    if(values.total <= 0){
        errors.total = 'Total must be a positive value';
    }
    if(!values.total){
        errors.total = 'Total required';
    }


    if(isNaN(values.current)){
        errors.current = 'Current total must be a number.';
    }
    if(parseFloat(values.current) > parseFloat(values.total)){
        errors.current = 'Current total cannot be lower than total';
        errors.total = 'Current total cannot be lower than total';
    }
    if(!values.current){
        errors.current = 'Current required';
    }

    return errors;
}

export default validateGoal;
