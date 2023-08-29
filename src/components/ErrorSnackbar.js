import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function ErrorSnackbar(props) {
    return (
            <Box sx={{ width: 500 }}>
                <Snackbar
                    autoHideDuration={2500}
                    anchorOrigin={{ vertical:'top', horizontal:'center' }}
                    open={props.errorSnackbarOn}
                    onClose={props.toSetErrorSnackbarOff}>
                    <Alert onClose={props.toSetErrorSnackbarOff} severity="error" sx={{ width: '100%' }}>
                        {props.message}
                    </Alert>
                </Snackbar>
            </Box>
    );
}

export default ErrorSnackbar;