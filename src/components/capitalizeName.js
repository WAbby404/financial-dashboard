function capitalizeName(formValues, setFormValues) {
    if( typeof formValues === 'string'){
        let capitalizedName = formValues.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
                    return capitalizedName;
    } else {
        const name = formValues.name;
        let capitalizedName = name.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        setFormValues({...formValues, name: capitalizedName});
    }
}

export default capitalizeName;