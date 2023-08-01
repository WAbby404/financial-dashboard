import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function SuccessSnackbar(props) {
    return (
        <div>
            <Box sx={{ width: 500 }}>
                <Snackbar
                    autoHideDuration={2500}
                    anchorOrigin={{ vertical:'top', horizontal:'center' }}
                    open={props.successSnackBarOn}
                    onClose={props.toSetSuccessSnackBarOff}
                >
                    <Alert onClose={props.toSetSuccessSnackBarOff} severity="success" sx={{ width: '100%' }}>
                        {props.message}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
}

export default SuccessSnackbar;