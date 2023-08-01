import React, { useState } from 'react';
import { auth } from '../../config/Firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { getDatabase, ref, push} from "firebase/database";
// , set

function Register(props) {
    const initialUserInfo = {name: "", email: "", password:""};
    const [ userInfo, setUserInfo ] = useState(initialUserInfo);
    const [ cleanUserInfo, setCleanUserInfo] = useState({});
    const [ formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
       const { name, value } = e.target;
       setUserInfo({...userInfo, [name]: value});
    };

    const validate = (values) => {
        const errors = {};
        if( !values.name ){
            errors.name = 'Name required';
        }
        // follow email format
        if(!values.email){
            errors.email = 'Email required.';
        }
        if(!values.email.includes('@') || !values.email.includes('.')){
            errors.email = 'Email must follow Email format ex. Email@email.com';
        }
        if(!values.password){
            errors.password = 'Password required.';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(userInfo);
        setFormErrors(errors);

        if(Object.keys(errors).length === 0){
            setCleanUserInfo(userInfo);
            registerFirebase();
        }
    };

    const registerFirebase = () =>{
        createUserWithEmailAndPassword(auth, cleanUserInfo.email, cleanUserInfo.password)
        .then((userCredential) =>{
            updateProfile(auth.currentUser, {
                displayName: `${cleanUserInfo.name}`})
            const user = userCredential.user;
            // console.log(user);
            alert("Account successfully created!");
            // redirect to dashboard (Router)
            setCleanUserInfo({});


            const newUserAccounts = [
                {name: 'Checking', checkingAccount: true, total: 0, id:Math.random()*1000, notEditable:true},
                {name: 'Savings', checkingAccount: true, total: 0, id:Math.random()*1000, notEditable:true},
                {name: 'Credit Card', checkingAccount: false, total: 0, id:Math.random()*1000, notEditable:true}
            ];

            const db = getDatabase();
            const dbAccountsRef = ref(db, user.uid + '/accounts');
            const newAccountPostRef = push(dbAccountsRef);
            newUserAccounts.forEach((account) => {
                push(newAccountPostRef, {
                    ...account
                });
            })

            // console.log(user.uid);
            // console.log(newAccountPostRef);
            // set(newAccountPostRef, {
            //     ...newUserAccountsObj
            // });

            // set(newAccountPostRef, {
            //     ...creditAccount
            // });

            // newUserAccounts.forEach((account) =>  {
            //     set(newAccountPostRef, {
            //         ...account
            //     })
            // })

            // set(newTransactionPostRef, {
            //     ...debitAccount
            // });
            // set(newTransactionPostRef, {
            //     ...savingAccount
            // });
            // set(newTransactionPostRef, {
            //     ...creditAccount
            // });

    
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        })
    };

    return (
         <div>
            <form onSubmit={handleSubmit} className="border">
                <label className="labels">Name:</label>
                <br/>
                <input className="input-fields"
                    name="name" 
                    placeholder="Name"
                    type="text"
                    value={userInfo.name}
                    onChange={handleChange}>
                </input>
                <p>{formErrors.name}</p>
                <label className="labels">Email:
                <br/>
                    <input className="input-fields"
                    name="email" 
                    placeholder="Email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleChange}></input>
                </label>
                <p>{formErrors.email}</p>
                <label className="labels">Password:
                <br/>
                    <input className="input-fields"
                    name="password" 
                    placeholder="Password"
                    type="text"
                    value={userInfo.password}
                    onChange={handleChange}></input>
                </label>
                <p>{formErrors.password}</p>
                <input type="submit" value='Register' className="submit-btn"></input>
            </form>
        </div>
    );
}

export default Register;