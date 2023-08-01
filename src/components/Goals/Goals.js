import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';

function Goals(props) {
    const [ count, setCount ] = useState(0);
    const [ user ] = useAuthState(auth);

    // Get all goals from database & store in an array to render on screen
    useEffect(()=> {
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/goals');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                setCount(count + 1);
                // if values id is found in the allgoals array dont add it
                let check = props.allGoals.some(item => item.id === childData.id);
                if(!check){
                    let oldGoals = props.allGoals;
                    oldGoals.push(childData);
                    props.toSetAllGoals(oldGoals);
                }
            })});
    }, []);
    
    const deleteGoal = (goalToDelete, index) => {
        props.deleteGoal(goalToDelete, index);
        setCount(count + 1);
    }

    const editGoal = (goal, index) => {
        props.editGoal(goal, index);
        props.deleteGoal(goal, index);
        setCount(count + 1);
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
                    <li key={goalList[0].id} className="goal">
                        <div  className="goal__wrapper">
                            <h3 className="goal__title">{goalList[0].name}</h3>
                            <LinearProgress variant="determinate" value={Math.floor(goalList[0].current / goalList[0].total * 100)}
                                sx={{
                                    backgroundColor: '#D7CDFF',
                                    '& .MuiLinearProgress-bar': {
                                              backgroundColor: goalBarColor(goalList[0])
                                            //   backgroundColor: 'hsl(100, 100%, 50%)'
                                            },
                                    height: 50,
                                    borderRadius: 1,
                                }}
                            />
                            <p><span>$</span>{` ${goalList[0].current} / `}<span>$</span>{` ${goalList[0].total}`}</p> 
                            <div className="goals-small-buttons">
                                {props.modalOn &&
                                    <Button onClick={() => editGoal(goalList[0], 0)} size="small" color="error" variant="outlined">
                                        <EditIcon/>
                                    </Button>
                                }
                                {props.modalOn &&
                                    <Button onClick={() => deleteGoal(goalList[0], 0)} size="small" variant="contained">
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
                            <li key={goal.id} className="goal">
                                <div className="goal__wrapper">
                                    <h3 className="goal__title">{goal.name}</h3>
                                    <LinearProgress variant="determinate" value={Math.floor(goal.current / goal.total * 100)}
                                      sx={{
                                        backgroundColor: '#D7CDFF',
                                        '& .MuiLinearProgress-bar': {
                                                  backgroundColor: goalBarColor(goal)
                                                //   backgroundColor: 'hsl(100, 100%, 50%)'
                                                },
                                        height: 50,
                                        borderRadius: 1,
                                      }} />
                                    <p><span>$</span>{` ${goal.current} / `}<span>$</span>{` ${goal.total}`}</p>
                                    <div className="goals-small-buttons">
                                        {props.modalOn &&
                                        <Button onClick={() => editGoal(goal, index)} size="small" color="error" variant="outlined">
                                            <EditIcon/>
                                        </Button>}
                                        {props.modalOn && 
                                        <Button onClick={() => deleteGoal(goal, index)} size="small" variant="contained">
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
                return <div>Goal list empty{!props.modalOn && ', add a goal in Manage Goals'}</div>;
        }
    };

    return (
        <div className="goals__wrapper">
            <ul className="goals">
            {renderSwitch(props.allGoals)}
            </ul>
        </div>
    );
}

export default Goals;