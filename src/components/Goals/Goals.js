import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';

function Goals(props) {
    const [ user ] = useAuthState(auth);
    const [ count, setCount ] = useState(0);

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
                    // console.log(oldGoals);
                }
                setCount(count + 1);
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

    const renderBackgroundColor = () => {
        return props.theme === 'dark' ? '#D7CDFF' : 'rgb(224 231 255)';
    }

    const formatMoney = (money) => {
        let formattedMoney = money.split('.');
        return (
            <div className="flex">
                <div className="text-xs pt-1">$</div>
                <div>{formattedMoney[0]}</div>
                <div className="text-xs pt-1">{formattedMoney[1] && `.${formattedMoney[1]}`}</div>
            </div>
        )
    }

    const renderSwitch = (goalList) => {
        switch(true) {
            // case for 1 transaction
            case (goalList.length === 1):
                return (
                    <li key={goalList[0].id} data-testid={`goal-0`} className="w-28 xl:pb-2">
                        <div className={`flex flex-col justify-center items-center text-center ${props.modalOn ? 'gap-0.5' : 'gap-1'}`}>
                            <h3 className='text-indigo-900 flex items-center basis-1/3 text-ellipsis font-medium h-4 dark:text-indigo-300 sm:text-sm xl:text-base'>{goalList[0].name}</h3>
                            <div className="w-full h-full relative basis-1/3">
                                <LinearProgress variant="determinate" value={Math.floor(goalList[0].current / goalList[0].total * 100)}
                                    sx={{
                                        backgroundColor: renderBackgroundColor(),
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
                                    <span>%</span>
                                </div>
                            </div>
                            <h4 className='flex basis-1/3 justify-center gap-1 pt-1 text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm xl:text-base'>
                                {formatMoney(goalList[0].current)}
                                /
                                {formatMoney(goalList[0].total)}
                            </h4> 
                            <div className="flex justify-center gap-1">
                                {props.modalOn &&
                                    <Button onClick={() => editGoal(goalList[0], 0)} size="small" color="secondary" variant="outlined"
                                        disabled={props.editOn ? true : false}
                                        aria-label='Edit goal'
                                        data-testid={`goalEdit-0`}
                                        sx={{color: 'orange'}}>
                                        <EditIcon/>
                                    </Button>
                                }
                                {props.modalOn &&
                                    <Button onClick={() => deleteGoal(goalList[0], 0)} size="small" color="error" variant="outlined"
                                        aria-label='Delete goal'
                                        data-testid={`goalDelete-0`}
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
                            <li key={goal.id} data-testid={`goal-${index}`} className="xl:pb-2 xl:max-w-sm flex">
                                <div className={`flex flex-col justify-center items-center text-center ${props.modalOn ? 'gap-0.5' : 'gap-1'}`}>
                                    <h3 className='text-indigo-900 flex items-center basis-1/3 text-ellipsis font-medium h-4 dark:text-indigo-300 sm:text-sm xl:text-base'>{goal.name}</h3>
                                    <div className="w-full h-full relative basis-1/3">
                                        <LinearProgress variant="determinate" value={Math.floor(goal.current / goal.total * 100)}
                                        sx={{
                                            backgroundColor: renderBackgroundColor(),
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
                                    <h4 className='flex basis-1/3 justify-center gap-1 pt-1 text-indigo-900 dark:text-indigo-300 font-medium sm:text-sm xl:text-base'>
                                        {formatMoney(goal.current)}
                                        /
                                        {formatMoney(goal.total)}
                                    </h4>
                                    <div className="flex justify-center gap-1">
                                        {props.modalOn &&
                                        <Button onClick={() => editGoal(goal, index)} size="small" color="secondary" variant="outlined"
                                            disabled={props.editOn ? true : false}
                                            aria-label='Edit goal'
                                            data-testid={`goalEdit-${index}`}
                                            sx={{color: 'orange'}}>
                                            <EditIcon/>
                                        </Button>}
                                        {props.modalOn && 
                                        <Button onClick={() => deleteGoal(goal, index)} size="small" color="error" variant="outlined"
                                            data-testid={`goalDelete-${index}`}
                                            aria-label='Delete goal'
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
            <ul data-testid={props.modalOn ? 'goalsListModal' : 'goalsList'} className="overflow-x-auto overflow-y-hidden flex gap-9 w-full pl-3 py-2 xl:py-0">
                {renderSwitch(props.allGoals)}
            </ul>
            {/* <div className="absolute z-40 w-24 h-4/6 bg-gradient-to-r from-transparent to-indigo-900 "></div> */}
        </article>
    );
}

export default Goals;