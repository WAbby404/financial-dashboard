import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, onValue } from "firebase/database";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebAssetIcon from '@mui/icons-material/WebAsset';

function Nav(props) {
    const [ user ] = useAuthState(auth);
    const [ profileImgData, setProfileImgData ] = useState({});

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/userData');
        let imgData;
        onValue(dbRef, (snapshot) => {
            imgData = snapshot.val();
            setProfileImgData(imgData);
        },{onlyOnce: true})
    }, []); // eslint-disable-line

    return (
        <div className="absolute bg-gray-950/75 w-full h-screen z-50 top-0 p-3 flex flex-col justify-center items-center xl:inset-x-0">
            <nav className={`${ props.darkMode ? 'dark' : ''} w-full absolute flex flex-col bg-slate-50 dark:bg-indigo-950 z-50 max-w-full h-full overflow-hidden p-3 justify-between md:w-6/12 md:left-2/4 lg:w-4/12 lg:left-[67%] xl:w-3/12 xl:left-[75%]`}>
                <figure className="flex flex-col gap-3 justify-center items-center align-center pt-12 sm:pt-4 md:pt-[30%]">
                    <div className='h-32 w-32 text-3xl font-semibold bg-indigo-300 rounded-full flex justify-center items-center sm:h-20 sm:w-20 md:h-32 md:w-32'>{profileImgData?.initials}</div>
                    <figcaption className="text-indigo-300">{profileImgData?.name}</figcaption>
                </figure>
                <footer className="flex flex-col gap-5 sm:gap-3 md:pb-12">
                    <div className="flex flex-col gap-2 w-2/5 m-auto md:w-4/5">
                        <Button size='small' onClick={() => props.toSetShowNavOff()} variant='outlined' sx={{color:'rgb(224 231 255)'}}>Close Navigation</Button>
                        <Button size='small' onClick={() => props.changeTheme()} sx={props.buttonStyles}>{props.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Button>
                        <Button size='small' onClick={() => auth.signOut()} sx={props.buttonStyles}>Sign out</Button>
                    </div>
                    <div className="flex gap-7 justify-center">
                        <IconButton target="_blank" rel="noopener noreferrer" title="Linkedin" aria-label="Linkedin" href='https://www.linkedin.com/in/abbywaddell4042/'>
                            <LinkedInIcon size='large' sx={{color: 'white'}}/>
                        </IconButton>
                        <IconButton target="_blank" rel="noopener noreferrer" title="Github" aria-label="Github" href='https://github.com/WAbby404'>
                            <GitHubIcon size='large' sx={{color: 'white'}}/>
                        </IconButton>
                        <IconButton target="_blank" rel="noopener noreferrer" title="Portfolio Site" aria-label="Portfolio Site" href='https://wabby404.github.io/portfolio-redo/'>
                            <WebAssetIcon size='large' sx={{color: 'white'}}/>
                        </IconButton>
                    </div> 
                </footer>
            </nav>
        </div>
       
    );
}

export default Nav;