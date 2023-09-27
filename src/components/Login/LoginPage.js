import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Login from './Login';
import Register from './Register';

function LoginPage(props) {
    const [register, setRegister] = useState(false);

    const inputLoginStyles = {
        backgroundColor: props.theme === 'dark' ? '#2e2270' : '',
        ".MuiInputLabel-root": {
            color: props.theme === 'dark' ? '#A5B4FC' : ''
        },
        input:{
            color: props.theme === 'dark' ? '#A5B4FC' : '',
        },
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: props.theme === 'dark' ? 'rgb(49 46 129)' : '',
        },
        width: 300,
        margin: 'auto',
        border: 'none'
    };

    return (
        <main className='w-full h-screen flex flex-col p-5 gap-4 justify-center sm:flex-row md:flex-col md:p-1 md:gap-10'>
            <section className="w-9/12 flex gap-1 flex-col mx-auto items-center justify-center">
                <img src='Moonlit logo.png' alt='Moonlit Logo' className="max-h-52 sm:max-h-36 md:max-h-64"/>
                <h1 className="text-indigo-900 dark:text-indigo-300 font-bold text-4xl sm:text-2xl md:text-4xl">Moonlit</h1>
                <h2 className="text-sky-400 text-center text-xl sm:text-base md:text-2xl">Personal Finance Dashboard</h2>
                {register ? 
                    <div className="hidden sm:flex sm:flex-row sm:gap-3 sm:items-center sm:justify-center sm:pt-3 md:hidden">
                        <h3 className="text-indigo-900 dark:text-indigo-300 text-center text-sm">Already have an account?</h3>
                        <Button onClick={() => setRegister(false)}
                        size="small"
                        sx={props.buttonStyles}>
                            Login
                        </Button>
                    </div>
                    :
                    <div className="hidden sm:flex sm:flex-row sm:gap-3 sm:items-center sm:justify-center sm:pt-3 md:hidden">
                            <h3 className="text-indigo-900 dark:text-indigo-300 text-center text-sm">Don't have an account?</h3>
                            <Button sx={props.buttonStyles}
                            data-testid="cypress-toregister"
                            size="small"
                            onClick={() => setRegister(true)}>Register</Button>
                    </div>
                }
            </section>
            <div className="w-9/12 mx-auto flex justify-center items-center">
                {register ?
                    <div className="flex flex-col gap-5 justify-center items-center">
                        <Register buttonStyles={props.buttonStyles} inputStyles={inputLoginStyles}/>
                        <div className="flex flex-row gap-3 items-center justify-center sm:hidden md:flex">
                            <h3 className="text-indigo-900 dark:text-indigo-300 text-center text-sm">Already have an account?</h3>
                            <Button onClick={() => setRegister(false)}
                                size="small"
                                sx={props.buttonStyles}>Login</Button>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col gap-5">
                        <Login buttonStyles={props.buttonStyles} inputStyles={inputLoginStyles}/>
                        <div className="flex flex-row gap-3 items-center justify-center sm:hidden md:flex">
                            <h3 className="text-indigo-900 dark:text-indigo-300 text-center text-sm">Don't have an account?</h3>
                            <Button sx={props.buttonStyles}
                            size="small"
                            data-testid="cypress-toregister"
                            onClick={() => setRegister(true)}>Register</Button>
                        </div>
                    </div>
                }
            </div>

        </main>
    );
};

export default LoginPage;