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
        return (
            <time className="flex basis-1/3 gap-2 items-center">
                <h3 className="text-lg font-semibold">{today[0]}</h3>
                <span>{today[1]}</span>
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
        backgroundColor: 'rgb(37 99 235)',
        '&:hover': {
            backgroundColor: 'rgb(30 64 175)'
        },
        boxShadow: 2
        // textTransform: 'lowercase !important'
    }

    return(
        <div className={`bg-indigo-950 container h-full max-w-full dark:bg-indigo-300`} >
            {console.log(theme)}
            { loading && <PulseLoader color="#523eed" />}
            { !user ? <LoginPage buttonStyles={buttonStyles}/> :
                <div className="static">
                    {showNav && <Nav theme={theme} changeTheme={changeTheme} buttonStyles={buttonStyles} toSetShowNavOff={toSetShowNavOff}/>}
                    <div className="h-full w-full">
                        <aside className="flex flex-row justify-between items-center p-3 text-indigo-300 dark:text-indigo-800">
                            <div className="basis-1/3">
                                <h1 className="">{capitalize(user?.displayName)}'s</h1>
                                <h2>Monthly Dashboard</h2>
                            </div>
                            {setDate()}
                            <IconButton onClick={() => toSetShowNavOn()}
                                sx={{color: 'white'}}
                                size="large">
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