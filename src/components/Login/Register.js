import React, { useState } from 'react';
import { auth } from '../../config/Firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import TextField from '@mui/material/TextField';
import { getDatabase, ref, update } from "firebase/database";
import Button from '@mui/material/Button';
import capitalizeName from '../capitalizeName';
import ErrorIcon from '@mui/icons-material/Error';

function Register(props) {
    const initialUserInfo = {name: "", email: "", password:""};
    const [ userInfo, setUserInfo ] = useState(initialUserInfo);
    const [ formErrors, setFormErrors] = useState({});
    const [ loginError, setLoginError ] = useState(null);

    const handleChange = (e) => {
       const { name, value } = e.target;
       setUserInfo({...userInfo, [name]: value});
       setFormErrors({...formErrors, [name]: null});
       setLoginError(null);
    };

    const validate = (values) => {
        const errors = {};
        if(!values.name){
            errors.name = 'Required';
        }
        // follow email format
        if(!values.email){
            errors.email = 'Email required.';
        }
        if(!values.email.includes('@') || !values.email.includes('.')){
            errors.email = 'Email must follow Email format';
        }
        if(!values.password){
            errors.password = 'Required.';
        }
        if(values.password.length < 6 ){
            errors.password = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(userInfo);
        setFormErrors(errors);
        setLoginError(null);

        if(Object.keys(errors).length === 0){
            registerFirebase();
        }
    };

    const registerFirebase = () =>{
        createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) =>{
            updateProfile(auth.currentUser, {
                displayName: `${userInfo.name}`})
            const user = userCredential.user;

            setUserInfo({});
            
            const newUserAccounts = {
                'Checking': {name: 'Checking', debit: true, total: 0, id:Math.random()*1000, notEditable:true},
                'Savings': {name: 'Savings', debit: true, total: 0, id:Math.random()*1000, notEditable:true},
                'Credit Card':{name: 'Credit Card', debit: false, total: 0, id:Math.random()*1000, notEditable:true}
            }

            const db = getDatabase();
            const accountsRef = ref(db, user.uid + '/accounts');
            update(accountsRef, newUserAccounts);

            const getInitials = (name) => {
                var initials = [];
                initials.push(name[0].toUpperCase());
                for (var i = 0; i < name.length; i++) {
                  if (name[i] === ' ') {
                    initials.push(name[i + 1].toUpperCase());
                  }
                }
                return initials.join('');
            };

            const userData = {
                name: `${capitalizeName(userInfo.name)}`,
                initials: getInitials(userInfo.name),
                // darkMode: true
            }
            const userDataRef = ref(db, user.uid + '/userData');
            // console.log(userData);
            update(userDataRef, userData);
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/email-already-in-use'){
                setLoginError('Email already in use.');
            }
            console.log(errorCode);
            console.log(errorMessage);
        })
    };

    return (
        <div className="flex flex-col gap-2 sm:gap-0.5 md:m-auto">
            <h2 className="text-indigo-900 dark:text-indigo-300 text-lg">Register an account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-1 md:w-full md:justify-center">
                <TextField
                    id="filled-basic" 
                    label="Name" 
                    variant="filled" 
                    name="name"
                    size="small"
                    value={userInfo.name}
                    onChange={handleChange}
                    error={formErrors?.name ? true : false}
                    helperText={formErrors?.name}
                    sx={props.inputStyles}
                    // sx={{backgroundColor: '#2e2270',
                    //     ".MuiInputLabel-root": {
                    //         color:'#A5B4FC'
                    //     },
                    //     input:{
                    //         color:'#A5B4FC',
                    //     },
                    //     width:{
                    //         sm:'300px',
                    //     }
                    // }}
                />
                <TextField
                    id="filled-basic" 
                    label="Email"
                    variant="filled"
                    name="email"
                    size="small"
                    value={userInfo.email}
                    onChange={handleChange}
                    error={formErrors?.email ? true : false}
                    helperText={formErrors?.email}
                    sx={props.inputStyles}
                    // sx={{backgroundColor: '#2e2270',
                    //     ".MuiInputLabel-root": {
                    //         color:'#A5B4FC'
                    //     },
                    //     input:{
                    //         color:'#A5B4FC',
                    //     },
                    //     width:{
                    //         sm:'300px',
                    //     }
                    // }}
                />
                <TextField
                    id="filled-basic" 
                    label="Password" 
                    variant="filled"
                    size="small"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    error={formErrors?.password ? true : false}
                    helperText={formErrors?.password}
                    sx={props.inputStyles}
                />
                <Button type="submit" sx={props.buttonStyles}>Register</Button>
                {loginError && 
                    <div className="text-rose-600 flex gap-2 items-center justify-center">
                        <ErrorIcon sx={{ color:'red', fontSize: 20 }}/>
                        {loginError}
                    </div>}
            </form>
        </div>
            
    );
}

export default Register;