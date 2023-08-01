import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";
import Goals from './Goals';
import GoalsForm from './GoalsForm';
import Button from '@mui/material/Button';
import EditDialogBox from '../EditDialogBox';
import SuccessSnackbar from '../SuccessSnackbar';
import './Goals.css';
import '../Dashboard.css';

function GoalsModal(props) {
    const [ user ] = useAuthState(auth);
    // Represents all goals, read from database
    const [ allGoals, setAllGoals ] = useState([]);
    const [ modalOn, setModalOn ] = useState(false);
    const [ formOn, setFormOn ] = useState(false);
    // Sets edit mode on, necessary for useEffect in GoalsForm, exiting while editing (with cancel and X) & dialog box
    const [ editOn, setEditOn ] = useState(false);
    const [ goalToEdit, setGoalToEdit ] = useState(null); 
    const [ successSnackBarOn, setSuccessSnackBarOn ] = useState(false);
    const [ dialogBoxOn, setDialogBoxOn ] = useState(false);
    const [ exitWithCancelOn, setExitWithCancelOn ] = useState(false);


    // vvv this is odd, i have an issue where if i modify an element in a state array or obj React wont push for an update, so i add 1 to a count which DOES push for an update
    // maybe i can try force update here
    const [ count, setCount ] = useState(0);
    

    
    const toSetFormOn = () => {
        setFormOn(true);
    };

    const toSetFormOff = () => {
        setFormOn(false);
        setExitWithCancelOn(false);
    };


    const toSetModalOn = () => {
        setModalOn(true);
    }

    const toSetModalOff = () => {
        setExitWithCancelOn(false);
        // alerts with dialog box while goal is being edited
        if(editOn){
            setDialogBoxOn(true);
        } else {
            setModalOn(!modalOn);
            setFormOn(false);
            setEditOn(false);
        }
    };
    
    const toSetEditOn = () => {
        setEditOn(true);
    };

    const toSetEditOff = () => {
        setEditOn(false);
    };

    // Sets which goal to edit, turn on form  & edit mode for GoalsForm useEffect
    const editGoal = (goalToEdit, index) => {
        setGoalToEdit(goalToEdit, index);
        setEditOn(true);
        setFormOn(true);
    };

    const toSetAllGoals = (newGoals) => {
        setAllGoals(newGoals);
    };


    const toSetExitWithCancelOn = () => {
        setExitWithCancelOn(true);
    }

    // Open / turn off the dialog box from cancel (in form while editing)
    const toSetDialogBoxOn = () => {
        setDialogBoxOn(true);
    };
        
    const toSetDialogBoxOff = () => {
        setDialogBoxOn(false);
    };

    // Called when pressing 'exit anyway' on dialog box after pressing x
    const exitDialogWithX = () => {
        setExitWithCancelOn(false);
        setModalOn(!modalOn);
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
    }

    // Called when pressing 'exit anyway' on dialog box after pressing cancel
    const exitDialogWithCancel = () => {
        setFormOn(false);
        setEditOn(false);
        setDialogBoxOn(false);
        setExitWithCancelOn(false);
    }

    
    // Turns off success snackbar alert
    const toSetSuccessSnackBarOff = () => {
        setSuccessSnackBarOn(false);
    };

    const createGoal = (cleanFormValues) =>{
        const db = getDatabase();
        const postListRef = ref(db, user.uid + '/goals');
        const newPostRef = push(postListRef);
        set(newPostRef, {
            ...cleanFormValues
        });
        setCount(count + 1);
        setEditOn(false);
        setSuccessSnackBarOn(true);
    };

    const deleteGoal = (goalToDelete, index) => {
        const idToDel = goalToDelete.id;
        const db = getDatabase();
        const dbRef = ref(db, user.uid + '/goals');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if(childData.id === idToDel){
                    let newgoal = allGoals;
                    newgoal.splice(index, 1);
                    setAllGoals(newgoal);
                    remove(ref(db, user.uid + `/goals/${childKey}`));
                }
        })});
        setCount(count + 1);
    };

    return (
        <div className="modal goalsModal">
            <div className="goals__spacebetween">
                <h3 className="modal--title">
                    Goals
                </h3>
                <Button onClick={() => toSetModalOn()} variant='contained'>
                    Manage Goals
                </Button>
            </div>
            <Goals 
                allGoals={allGoals}
                toSetAllGoals={toSetAllGoals}
                darkMode={props.darkMode}/>
            {modalOn &&
            <div className="overlay">
                <SuccessSnackbar 
                    message='Goal created!'
                    successSnackBarOn={successSnackBarOn} 
                    toSetSuccessSnackBarOff={toSetSuccessSnackBarOff}/>
                <EditDialogBox 
                    dialogBoxOn={dialogBoxOn}
                    toSetDialogBoxOff={toSetDialogBoxOff} 
                    toSetDialogBoxOffAndClearGoal={exitWithCancelOn ? exitDialogWithCancel : exitDialogWithX} 
                    dialogTitle="Exit while editing your goal?"
                    dialogText="Exiting now will cause the goal you are editing to be lost."/>
                <div className="overlay__modal">
                    <div className="overlay__title--spacing">
                        <h3 className="modal--title">Goals</h3>
                        <Button onClick={() => toSetModalOff()} variant='contained'>
                            X
                        </Button>
                    </div>
                    <Goals 
                        modalOn={modalOn}
                        toSetAllGoals={toSetAllGoals}
                        allGoals={allGoals}
                        deleteGoal={deleteGoal}
                        editGoal={editGoal}
                        darkMode={props.darkMode}/>
                    <GoalsForm
                        formOn={formOn}
                        toSetFormOn={toSetFormOn}
                        toSetFormOff={toSetFormOff}
                        editOn={editOn}
                        goalToEdit={goalToEdit}
                        toSetEditOn={toSetEditOn}
                        toSetEditOff={toSetEditOff}
                        toSetExitWithCancelOn={toSetExitWithCancelOn}
                        toSetDialogBoxOn={toSetDialogBoxOn}
                        createGoal={createGoal}
                        deleteGoal={deleteGoal}/>
                </div>
            </div>
            }
        </div>
    );
}

export default GoalsModal;