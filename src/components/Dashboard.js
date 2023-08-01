import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/Firebase';
import LoginPage from './Login/LoginPage';
import Nav from './Nav/Nav';
import AccountsModal from "./Accounts/AccountsModal";
import SpendingModal from "./Spending/SpendingModal";
import AnalyticsModal from './Analytics/AnalyticsModal';
import TransactionsModal from './Transactions/TransactionsModal';
import GoalsModal from './Goals/GoalsModal';
import './Dashboard.css';
import PulseLoader from "react-spinners/PulseLoader";
import { GiHamburgerMenu } from 'react-icons/gi';
 
function Dashboard(props) {
    const [ darkMode, setDarkMode ] = useState(true);
    const [ showNav, setShowNav ] = useState(false);
    const [ user, loading ] = useAuthState(auth);

    const changeTheme = () => {
        setDarkMode(!darkMode);
    };

    const setDate = () => {
        const today = new Date().toLocaleDateString().split('/');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'];
        today[0] = months[today[0]-1];
        // if(today[0] === 'Tue'){
        //     today[0] = today[0] + 'sday';
        // } else if (today[0] === 'Wed') {
        //     today[0] = today[0] + 'nesday';
        // } else if (today[0] === 'Thu'){
        //     today[0] = today[0] + 'rsday';
        // } else if (today[0] === 'Sat'){
        //     today[0] = today[0] + 'urday';
        // } else {
        //     today[0] = today[0] + 'day';
        // }
        // console.log(today);
        return (
            <div className="dashboard__title flex">
                <h3>{today[0]}</h3>
                <span>{today[1]}</span>
            </div>
        )
    }

    return(
        <div className={`${darkMode ? 'dark' : 'light'} dashboard`} >
            { loading && <PulseLoader color="#523eed" />}
            { !user && <LoginPage  /> }
            { user &&
            <div className="dashboard__wrapper">
                <div className="dashboard__container">
                    <div className="dashboard--info">
                        <div className="dashboard__title">
                            <h1>Welcome { user?.displayName}!</h1>
                            <h2>Your monthly Dashboard</h2>
                            <br/>
                        </div>
                            {setDate()}
                        <button className="dashboard__btn" onClick={() => setShowNav(!showNav)}>
                            <GiHamburgerMenu size='2em'/>
                        </button>
                    </div>
                    <main className="modal__container">
                        <AccountsModal darkMode={darkMode}/>
                        <GoalsModal darkMode={darkMode}/>
                        <SpendingModal darkMode={darkMode}/>
                        <TransactionsModal darkMode={darkMode}/>
                        <AnalyticsModal darkMode={darkMode}/>
                    </main>  
                </div>
                {showNav && <Nav darkMode={darkMode} changeTheme={changeTheme}/>}
            </div>
            }
        </div>
    )
}

export default Dashboard;