import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { AiFillLinkedin, AiFillGithub, AiOutlineLink } from "react-icons/ai";
import './Nav.css';

function Nav(props) {
    const [ user ] = useAuthState(auth);

    return (
        <div className="nav--background">
            <div className={`${ props.darkMode ? 'dark' : ''} nav nav--background`} data-testid='navDiv'>
                <div className="nav__text">
                    <div className="icon"></div>
                    {/* <img src={user?.photoURL } alt={`${user?.displayName}'s profile img`}/> */}
                    <h1 className="nav--title">{user?.displayName}</h1>
                    <p>Your dashboard for the month of MONTH</p>
                </div>
                <div className="nav__socials">
                    <div className="nav--flex">
                        <button className="btn nav__btn" onClick={() => {props.changeTheme()}}>{props.darkMode ? 'Light Mode' : 'Dark Mode'}</button>
                        <button className="btn nav__btn" onClick={() => auth.signOut()}>Sign out</button>
                    </div>
                    <div className="socials--flex">
                        <a className="social--link" target="_blank" rel="noopener noreferrer" title="Linkedin" aria-label="Linkedin" href='https://www.linkedin.com/in/abbywaddell4042/'><AiFillLinkedin size={40}/></a>
                        <a className="social--link" target="_blank" rel="noopener noreferrer" title="Github" aria-label="Github" href='https://github.com/WAbby404'><AiFillGithub size={40}/></a>
                        <a className="social--link" target="_blank" rel="noopener noreferrer" title="Portfolio Site" aria-label="Portfolio Site" href='AiOutlineLink'><AiOutlineLink size={40}/></a>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default Nav;