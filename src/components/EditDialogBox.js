import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function EditDialogBox(props) {

    return (
        <div>
            <Dialog
                open={props.dialogBoxOn}
                onClose={props.toSetDialogBoxOff}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.toSetDialogBoxOff}>Continue editing</Button>
                <Button onClick={props.toSetDialogBoxOffAndClearGoal} autoFocus>
                    Exit anyway
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditDialogBox;