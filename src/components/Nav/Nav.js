import React from 'react';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebAssetIcon from '@mui/icons-material/WebAsset';

function Nav(props) {

    return (
        <div className={`${props.showNav ? "translate-x-0" : "translate-x-full"} delay-100 ease-in-out fixed bg-gray-950/75 w-full h-screen z-50 top-0 p-3 flex flex-col justify-center items-center xl:inset-x-0`}>
            <nav id="navsidebar" role='region' aria-labelledby="navcontrol" className={`${ props.theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-indigo-950 absolute flex flex-col z-50 w-full h-full p-3 justify-between md:w-6/12 md:left-2/4 lg:w-4/12 lg:left-[67%] xl:w-3/12 xl:left-[75%] ${props.showNav ? "translate-x-0" : "translate-x-full"} ease-in-out duration-300`}>
                <div className="flex flex-col gap-3 items-center justify-center">
                    <div className="flex flex-col justify-center text-center">
                        <h1 className="text-indigo-900 dark:text-indigo-300 font-bold text-2xl">Moonlit</h1>
                        <h2 className="text-sky-400">Personal Finance Dashboard</h2>
                    </div>
                    <figure className="flex flex-col gap-3 justify-center items-center align-center pt-12 sm:pt-4 md:pt-[30%]">
                    <div className='h-32 w-32 text-3xl font-semibold bg-indigo-300 rounded-full flex justify-center items-center sm:h-20 sm:w-20 md:h-32 md:w-32'>{props.userData.initials}</div>
                    <h3 data-testid="navUserName" className="text-indigo-900 dark:text-indigo-300">{props.userData.name}</h3>
                </figure>
                </div>
                <footer className="flex flex-col gap-5 sm:gap-3 md:pb-12">
                    <div className="flex flex-col gap-2 w-2/5 m-auto md:w-4/5">
                        <Button size='small' 
                            onClick={() => props.toSetShowNavOff()} 
                            sx={props.buttonStyles} 
                            tabIndex={props.showNav ? 1 : -1}
                            data-testid="navClose">Close Navigation</Button>
                        <Button size='small' 
                            onClick={() => props.changeTheme()} 
                            sx={props.buttonStyles} 
                            tabIndex={props.showNav ? 1 : -1}
                            data-testid="navLightMode">{props.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Button>
                        <Button size='small' 
                            onClick={() => {
                                auth.signOut();
                                props.toSetShowNavOff();
                            }}
                            sx={props.buttonStyles} 
                            tabIndex={props.showNav ? 1 : -1} 
                            data-testid="cypress-signout"
                        >Sign out</Button>
                    </div>
                    <div className="flex gap-7 justify-center">
                        <IconButton target="_blank" rel="noopener noreferrer" title="Linkedin" aria-label="Abby Waddell's Linkedin" href='https://www.linkedin.com/in/abbywaddell4042/' tabIndex={props.showNav ? 1 : -1}>
                            <LinkedInIcon size='large' sx={{color: props.theme === 'dark' ? 'white' : 'grey'}}/>
                        </IconButton>
                        <IconButton target="_blank" rel="noopener noreferrer" title="Github" aria-label="Abby Waddell's Github" href='https://github.com/WAbby404' tabIndex={props.showNav ? 1 : -1}>
                            <GitHubIcon size='large' sx={{color: props.theme === 'dark' ? 'white' : 'grey'}}/>
                        </IconButton>
                        <IconButton target="_blank" rel="noopener noreferrer" title="Portfolio Site" aria-label="Abby Waddell's Portfolio Site" href='https://wabby404.github.io/portfolio-redo/' tabIndex={props.showNav ? 1 : -1}>
                            <WebAssetIcon size='large' sx={{color: props.theme === 'dark' ? 'white' : 'grey'}}/>
                        </IconButton>
                    </div> 
                </footer>
            </nav>
        </div>
       
    );
}

export default Nav;