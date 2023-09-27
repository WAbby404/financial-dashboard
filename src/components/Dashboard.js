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
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoadingScreen from './LoadingScreen';
 
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
            <time className="flex basis-1/3 items-center">
                <h3 className="text-lg xl:text-2xl font-semibold">{today[0]} <span>{today[1] + dateSuffix}</span></h3>
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
    };

    const navButtonStyle = {
        color: theme === 'dark' ? 'rgb(165 180 252)' : 'rgb(49 46 129)',
        fontSize: 30,
    };

    const inputStyles = {
        backgroundColor: theme === 'dark' ? '#2e2270' : '',
        ".MuiInputLabel-root": {
            color: theme === 'dark' ? '#A5B4FC' : ''
        },
        input:{
            color: theme === 'dark' ? '#A5B4FC' : '',
        },
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor:  theme === 'dark' ? 'rgb(49 46 129)' : '',
        },
        width: {
            xs: 150,
            sm: 150,
            md: 300,
        },
        margin: 'auto',
        border: 'none'
    };

    return(
        <div className='bg-indigo-100 dark:bg-indigo-950 h-full max-w-full overflow-x-hidden transition-all xl:h-screen'>
            { loading && <LoadingScreen/>}
            { !user ? <LoginPage buttonStyles={buttonStyles} inputStyles={inputStyles} theme={theme}/> :
                <div className="static w-screen overflow-x-hidden">
                    <Nav theme={theme} changeTheme={changeTheme} showNav={showNav} buttonStyles={buttonStyles} toSetShowNavOff={toSetShowNavOff}/>
                    <div className="h-full w-full">
                        <aside className="flex flex-row justify-between items-center p-3 text-indigo-900 dark:text-indigo-300">
                            <div className="basis-1/3 flex flex-col gap-1 md:gap-2 sm:items-center sm:flex-row">
                                <h1 className="text-lg md:text-2xl font-semibold">{capitalize(user?.displayName)}'s</h1>
                                <h2 className="md:self-end">Dashboard</h2>
                            </div>
                            {setDate()}
                            <IconButton 
                                data-testid="cypress-navcontrol"
                                onClick={() => toSetShowNavOn()} 
                                sx={navButtonStyle} 
                                aria-expanded={showNav ? 'true' : 'false'} 
                                aria-controls="navsidebar" 
                                id='navcontrol' 
                                aria-label="Expand Navigation" 
                                tabIndex={showNav ? -1 : 0}>
                                <MenuIcon/>
                            </IconButton>
                        </aside>
                        <main className="flex flex-col sm:gap-4 md:gap-5 pb-4 xl:grid xl:grid-cols-12 xl:grid-rows-18 xl:gap-4 xl:h-[93vh] xl:p-4">
                            <AccountsModal showNav={showNav} theme={theme} buttonStyles={buttonStyles} inputStyles={inputStyles}/>
                            <GoalsModal showNav={showNav} theme={theme} buttonStyles={buttonStyles} inputStyles={inputStyles}/>
                            <SpendingModal showNav={showNav} theme={theme}/>
                            <TransactionsModal showNav={showNav} theme={theme} buttonStyles={buttonStyles} inputStyles={inputStyles}/>
                            <AnalyticsModal theme={theme}/>
                        </main>  
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard;