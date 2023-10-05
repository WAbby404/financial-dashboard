import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function EditDialogBox(props) {

    const dialogTheme = {
        backgroundColor: props.theme === 'dark' ? 'rgb(49 46 129)' : 'bg-slate-50',
        color: props.theme === 'dark' ? 'rgb(165 180 252)' : 'rgb(30 27 75)',
    };

    return (
        <div>
            <Dialog
                open={props.dialogBoxOn}
                onClose={props.toSetDialogBoxOff}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" 
            >
            <DialogTitle id="alert-dialog-title" sx={dialogTheme}>
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent sx={dialogTheme}>
                <DialogContentText id="alert-dialog-description" sx={dialogTheme}>
                    {props.dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={dialogTheme}>
                <Button sx={props.buttonStyles} 
                    onClick={props.toSetDialogBoxOff}
                    data-testid='dialogContinue'>Continue editing</Button>
                <Button sx={props.buttonStyles} 
                    onClick={props.toSetDialogBoxOffAndClearGoal}
                    data-testid='dialogExit'>
                    Exit anyway
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditDialogBox;