import React, { useState } from 'react';
// import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
// import { getDatabase, ref} from "firebase/database";
// , push, set, onValue, remove
// import { auth } from '../../config/Firebase';
import Login from './Login';
import Register from './Register';
// import '../styles/Forms.css';

function LoginPage(props) {
    const [register, setRegister] = useState(false);
    // const googleProvider = new GoogleAuthProvider();

    // const GoogleLogin = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, googleProvider);
    //         console.log('Result:');
    //         console.log(result);
    //         if(result){
    //             const userId = result.user.uid;
    //             // trying out initialization
    //             const db = getDatabase();
    //             const dbRef = ref(db, userId);
    //             console.log(dbRef);
    //             // onValue(dbRef, (snapshot) => {
    //             //     snapshot.forEach((childSnapshot) => {
    //             //         const childKey = childSnapshot.key;
    //             //         const childData = childSnapshot.val();
    //             //         // if childData.id equals the id we want to delete, then remove it from the database
    //             //         // and from allTransactions
    //             //         if(childData.id === idToDel){
    //             //             let newTransactions = allTransactions;
    //             //             newTransactions.splice(index, 1);
    //             //             setAllTransactions(newTransactions);
    //             //             remove(ref(db, 'transactions/' + user.uid + `/${childKey}`));
    //             //         }
    //             //     })});


    //         }
    //         // console.log(result.user);
    //     } catch (error) {
    //         // console.log(error);
    //     }
    // };


    return (
        <div className = 'flex'>
            <div>
                <div>
                    {register ?
                    <>
                        <Register />
                        <div>Already have an account?</div>
                        <button onClick={() => setRegister(false)}>Login</button>
                        {/* <button onClick={GoogleLogin}>
                            <FaGoogle />
                            Login with Google
                        </button> */}
                    </>
                
                    :
                    <>
                        <Login />
                        {/* <button className="btn--submit" onClick={GoogleLogin}>
                            <FaGoogle />
                            Sign in with Google
                        </button> */}
                        <div>Dont have an account?</div>
                        <button className="btn--submit"
                        onClick={() => setRegister(true)}>Register</button>
                    </>
                }</div>
            </div>
            <div className="login--right">
                <h1>Moonlit Personal Finance Dashboard</h1>
            </div>
        </div>
    );
};

export default LoginPage;