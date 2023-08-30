import React, { useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';

function Goals(props) {
    const [ user ] = useAuthState(auth);

    // Get all goals from database & store in an array to render on screen
    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/goals');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                // if values id is found in the allgoals array dont add it
                let check = props.allGoals.some(item => item.id === childData.id);
                if(!check){
                    let oldGoals = props.allGoals;
                    oldGoals.push(childData);
                    props.toSetAllGoals(oldGoals);
                }
            })});
    }, []); // eslint-disable-line
    
    const deleteGoal = (goalToDelete, index) => {
        props.deleteGoal(goalToDelete, index);
    }

    const editGoal = (goal, index) => {
        props.editGoal(goal, index);
        props.deleteGoal(goal, index, true);
    }

    const goalBarColor = (goal) => {
        let goalColor = Math.floor((goal.current / goal.total) * 100);
        return `hsl(${goalColor}, 100%, 50%)`
    }

    const renderSwitch = (goalList) => {
        switch(true) {
            // case for 1 transaction
            case (goalList.length === 1):
                return (
                    <li key={goalList[0].id} className="w-28 xl:pb-2">
                        <div className="flex flex-col justify-center text-center">
                            <h3 className={`text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm ${ props.modalOn ? 'xl:text-lg' : 'xl:text-base'}`}>{goalList[0].name}</h3>
                            <div className="w-full h-full relative">
                                <LinearProgress variant="determinate" value={Math.floor(goalList[0].current / goalList[0].total * 100)}
                                    sx={{
                                        backgroundColor: '#D7CDFF',
                                        '& .MuiLinearProgress-bar': {
                                                backgroundColor: goalBarColor(goalList[0])
                                                },
                                        height: 50,
                                        borderRadius: 1,
                                        width: '100px',
                                        margin: '0 auto'
                                    }}
                                />
                                <div className="absolute w-full top-1/4 m-auto text-lg font-semibold text-indigo-900">
                                    {Math.floor(goalList[0].current / goalList[0].total * 100)}
                                    <span className="">%</span>
                                </div>
                            </div>
                            <p className={`text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm ${ props.modalOn ? 'xl:text-lg' : 'xl:text-base'}`}>
                                <span className="text-xs">$</span>
                                {` ${goalList[0].current} / `}
                                <span className="text-xs">$</span>
                                {` ${goalList[0].total}`}
                            </p> 
                            <div className="flex justify-center gap-1">
                                {props.modalOn &&
                                    <Button onClick={() => editGoal(goalList[0], 0)} size="small" color="secondary" variant="outlined"
                                        disabled={props.editOn ? true : false}
                                        sx={{color: 'orange'}}>
                                        <EditIcon/>
                                    </Button>
                                }
                                {props.modalOn &&
                                    <Button onClick={() => deleteGoal(goalList[0], 0)} size="small" color="error" variant="outlined"
                                    sx={{color: 'red'}}>
                                        <DeleteIcon/>
                                    </Button>
                                }
                            </div>
                        </div>
                        
                    </li>
                );

            // case for multiple transactions
            case (goalList.length > 1):
                return (
                    goalList.map((goal, index) => {
                        return(
                            <li key={goal.id} className="w-28 xl:pb-2">
                                <div className="flex flex-col justify-center text-center">
                                    <h3 className={`text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm ${ props.modalOn ? 'xl:text-lg' : 'xl:text-base'}`}>{goal.name}</h3>
                                    <div className="w-full h-full relative">
                                        <LinearProgress variant="determinate" value={Math.floor(goal.current / goal.total * 100)}
                                        sx={{
                                            backgroundColor: '#D7CDFF',
                                            '& .MuiLinearProgress-bar': {
                                                    backgroundColor: goalBarColor(goal)
                                                    },
                                            height: 50,
                                            borderRadius: 1,
                                            width: '100px',
                                            margin: '0 auto'
                                        }} />
                                        <div className='absolute w-full top-1/4 m-auto text-lg font-semibold text-indigo-900'>
                                            {Math.floor(goal.current / goal.total * 100)}
                                            <span>%</span>
                                        </div>
                                    </div>
                                    <p className={`text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm ${ props.modalOn ? 'xl:text-lg' : 'xl:text-base'}`}>
                                        <span className="text-xs">$</span>
                                        {` ${goal.current} / `}
                                        <span className="text-xs">$</span>
                                        {` ${goal.total}`}
                                    </p>
                                    <div className="flex justify-center gap-1">
                                        {props.modalOn &&
                                        <Button onClick={() => editGoal(goal, index)} size="small" color="secondary" variant="outlined"
                                            disabled={props.editOn ? true : false}
                                            sx={{color: 'orange'}}>
                                            <EditIcon/>
                                        </Button>}
                                        {props.modalOn && 
                                        <Button onClick={() => deleteGoal(goal, index)} size="small" color="error" variant="outlined"
                                            sx={{color: 'red'}}>
                                            <DeleteIcon/>
                                        </Button>}

                                    </div>
                                </div>
                            </li>
                        );
                    })
                );
                
            // case for 0 transactions
            default:
                return <div className='text-indigo-300 font-medium p-3 text-center m-auto'>Goal list empty{!props.modalOn && ', add a goal in Manage Goals'}</div>;
        }
    };

    return (
        <article className="w-full h-full relative lg:w-10/12 lg:m-auto">
            {/* <div className="absolute z-40 w-24 h-4/6 bg-gradient-to-r from-indigo-900 "></div> */}
            <ul className="overflow-x-auto flex gap-9 w-full pl-3 py-2 xl:py-0">
                {renderSwitch(props.allGoals)}
                
            </ul>
            {/* <div className="absolute z-40 w-24 h-4/6 bg-gradient-to-r from-transparent to-indigo-900 "></div> */}
        </article>
    );
}

export default Goals;