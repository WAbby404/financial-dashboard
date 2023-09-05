import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/Firebase';
import LoginPage from './Login/LoginPage';
import Nav from './Nav/Nav';
import AccountsModal from "./Accounts/AccountsModal";
import SpendingModal from "./Spending/SpendingModal";
import AnalyticsModal from './Analytics/AnalyticsModal';
import TransactionsModal from './Transactions/TransactionsModal';
import GoalsModal from './Goals/GoalsModal';
import PulseLoader from "react-spinners/PulseLoader";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
 
function Dashboard() {
    const [ theme, setTheme ] = useState('dark');
    const [ showNav, setShowNav ] = useState(false);
    const [ user, loading ] = useAuthState(auth);

    useEffect(() => {
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    })

    const changeTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const setDate = () => {
        const today = new Date().toLocaleDateString().split('/');
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December'];
        today[0] = months[today[0]-1];
        let dateSuffix;
        if(today[1] === '1' || today[1] === '21' || today[1] === '31'){
            dateSuffix = 'st';
        } else if(today[1] === '2' || today[1] === '22'){
            dateSuffix = 'nd';
        } else if(today[1] === '3' || today[1] === '23'){
            dateSuffix = 'rd';
        } else {
            dateSuffix = 'th';
        }

        return (
            <time className="flex basis-1/3 gap-2 items-center">
                <h3 className="text-lg xl:text-2xl font-semibold">{today[0]}</h3>
                <span>{today[1] + dateSuffix}</span>
            </time>
        )
    }

    const capitalize = (name) => {
        if(name){
            let capitalizedName = name.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
            return capitalizedName;
        }
    }

    const toSetShowNavOn = () => {
        setShowNav(true);
        const body = document.querySelector("body");
        body.style.overflow = "hidden";
    }

    const toSetShowNavOff = () => {
        setShowNav(false);
        const body = document.querySelector("body");
        body.style.overflow = "auto";
    }

    const buttonStyles = {
        fontSize: 13,
        color: 'rgb(224 231 255)',
        backgroundColor: theme === 'dark' ? 'rgb(37 99 235)' : '#525298',
        '&:hover': {
            backgroundColor: theme === 'dark' ? 'rgb(30 64 175)' : 'rgb(49 46 129)',
        },
        boxShadow: 2
    }

    const navButtonStyle = {
        color: theme === 'dark' ? 'rgb(165 180 252)' : 'rgb(49 46 129)',
        fontSize: 30,
    }

    return(
        <div className='bg-indigo-100 dark:bg-indigo-950 h-full xl:h-screen max-w-full transition-all'>
            { loading && <PulseLoader color="#523eed" />}
            { !user ? <LoginPage buttonStyles={buttonStyles}/> :
                <div className="static">
                    <Nav theme={theme} changeTheme={changeTheme} showNav={showNav} buttonStyles={buttonStyles} toSetShowNavOff={toSetShowNavOff}/>
                    {/* {showNav && <Nav theme={theme} changeTheme={changeTheme} showNav={showNav} buttonStyles={buttonStyles} toSetShowNavOff={toSetShowNavOff}/>} */}
                    <div className="h-full w-full">
                        <aside className="flex flex-row justify-between items-center p-3 text-indigo-900 dark:text-indigo-300">
                            <div className="basis-1/3 flex flex-col gap-1 md:gap-2 sm:items-center sm:flex-row">
                                <h1 className="text-lg md:text-2xl font-semibold">{capitalize(user?.displayName)}'s</h1>
                                <h2>Dashboard</h2>
                            </div>
                            {setDate()}
                            <IconButton onClick={() => toSetShowNavOn()} sx={navButtonStyle}>
                                <MenuIcon/>
                            </IconButton>
                        </aside>
                        <main className="flex flex-col sm:gap-4 md:gap-5 pb-4 xl:grid xl:grid-cols-12 xl:grid-rows-18 xl:gap-4 xl:h-[93vh] xl:p-4">
                            <AccountsModal theme={theme} buttonStyles={buttonStyles}/>
                            <GoalsModal theme={theme} buttonStyles={buttonStyles}/>
                            <SpendingModal theme={theme}/>
                            <TransactionsModal theme={theme} buttonStyles={buttonStyles}/>
                            <AnalyticsModal theme={theme}/>
                        </main>  
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard;