import React, { useState } from 'react';
import { auth } from '../../config/Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';

function Login(props) {
    const initialUserInfo ={ email: "", password: "" };
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
        // follows email format
        if( !values.email.includes('@') || !values.email.includes('.')){
            errors.email = 'Must follow email format ex. Email@email.com';
        }
        if(!values.email){
            errors.email = 'Email required.';
        }

        if(!values.password){
            errors.password = 'Password required.';
        }
        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(userInfo);
        setFormErrors(errors);
        setLoginError(null);

        if(Object.keys(errors).length === 0){
            loginFirebase();
        }
    }

    const loginFirebase = () => {
        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then(() => {
            setFormErrors({});
            setUserInfo(initialUserInfo);
        })      
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/user-not-found'){
                setLoginError('Email not registered.');
            } else if (errorCode === 'auth/wrong-password'){
                setLoginError('Incorrect password.');
            }
            console.log(errorCode);
            console.log(errorMessage);
            
        });
    };

    return (
        <div className="flex flex-col gap-2 sm:gap-1 md:m-auto">
            <h2 className="text-indigo-900 dark:text-indigo-300 text-lg">Sign In</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-1 md:w-full md:justify-center">
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
                    sx={{backgroundColor: '#2e2270',
                        ".MuiInputLabel-root": {
                            color:'#A5B4FC'
                        },
                        input:{
                            color:'#A5B4FC',
                        },
                        width:{
                            sm:'300px',
                        }
                    }}
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
                    sx={{backgroundColor: '#2e2270',
                    ".MuiInputLabel-root": {
                        color:'#A5B4FC'
                    },
                    input:{
                        color:'#A5B4FC',
                    },
                    width:{
                        sm:'300px',
                    }
                    }}
                />
                <Button type="submit" 
                    sx={props.buttonStyles}
                    // sx={{width:{
                    //     sm:'300px'
                    // },
                    // margin: {
                    //     lg: '10px 0 0 0'
                    // }
                    // }}
                >Login</Button>
                {loginError && 
                    <div className="text-rose-600 flex gap-2 items-center justify-center">
                        <ErrorIcon sx={{ color:'red', fontSize: 20 }}/>
                        {loginError}
                    </div>}
            </form>
        </div>
    );
}

export default Login;