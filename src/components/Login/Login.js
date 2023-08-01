import React, { useState } from 'react';
import { auth } from '../../config/Firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css';

function Login(props) {
    const initialUserInfo = {email: "", password:""};
    const [ userInfo, setUserInfo ] = useState(initialUserInfo);
    const [ formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
       const { name, value } = e.target;
       setUserInfo({...userInfo, [name]: value});
    };

    const validate = (values) => {
        const errors = {};
        // follows email format
        if( !values.email.includes('@') || !values.email.includes('.')){
            errors.email = 'Email must follow Email format ex. Email@email.com';
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

        if(Object.keys(errors).length === 0){
            loginFirebase();
        }
    }

    const loginFirebase = () => {
        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            console.log(userCredential);
            // const user = userCredential.user;
            // redirect to dashboard (Router)
            setFormErrors({});
            setUserInfo(initialUserInfo);
        })      
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    };

    return (
        <div>
            <h1 className="login__title">Sign In to your Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <div className="input--group">
                    <label className="labels">Email</label>
                    <input className="input-fields"
                        name="email"
                        placeholder="Type your email"
                        type="text"
                        value={userInfo.email}
                        onChange={handleChange}>
                    </input>
                    <p>{formErrors.email}</p>
                </div>
                <div className="input--group">
                    <label className="labels">Password</label>
                    <input className="input-fields"
                        name="password"
                        placeholder="Type your password"
                        type="text"
                        value={userInfo.password}
                        onChange={handleChange}>
                    </input>
                    <p>{formErrors.password}</p>
                </div>
                <div className="input--group">
                    <input type="submit" value='Login' className="btn--submit"></input>
                </div>
                
            </form>
        </div>
    );
}

export default Login;