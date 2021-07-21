import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Dialog, DialogActions, DialogTitle} from '@material-ui/core';
// context
import { useActiveStepValue } from "../../context";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const ButtonUI = () => {    
    const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();

    const classes = useStyles();

    const steps = ['MI Refresher', 'Practice Session', 'Discussion Prep', 'Collaborative Discussion', 'Self-Reflection', 'Complete'];

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    return (
        <div>
            <Box align="center" m = {2}>  
                <div>
                    <Button 
                        variant="contained"
                        disabled={activeStep === 0} 
                        onClick={handleBack} 
                        className={classes.button}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Are you sure you want to go to next session?"}</DialogTitle>
                        <DialogActions>
                            <Button 
                                variant="contained" 
                                onClick={handleClose} 
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => { handleNext(); handleClose();}} 
                                color="primary" 
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Box>
        </div>
    );
};

export default ButtonUI;