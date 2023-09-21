function validateGoal(values) {
    const errors = {}; 
    if(!values.name || values.name.trim().length === 0){
        errors.name = 'Name required';
    }
    if(values.name.length > 12){
        errors.name = 'Name cannot exceed 12 characters';
    }


    if(isNaN(values.total)){
        errors.total = 'Total must be a number';
    }
    if(values.total <= 0){
        errors.total = 'Total must be a positive value';
    }
    if(!values.total){
        errors.total = 'Total required';
    }
    if(values.total > 9999999.99){
        errors.total = 'Total cannot exceed $9,999,999.99'
    }


    if(isNaN(values.current)){
        errors.current = 'Current must be a number';
    }
    if(parseFloat(values.current) > parseFloat(values.total)){
        errors.current = 'Current cannot be lower than total';
        errors.total = 'Total cannot be lower than current';
    }
    if(!values.current){
        errors.current = 'Current required';
    }
    if(values.current < 0){
        errors.current = 'Current must be a positive value';
    }
    if(values.current > 9999999.99){
        errors.current = 'Current cannot exceed $9,999,999.99'
    }

    return errors;
}

export default validateGoal;
