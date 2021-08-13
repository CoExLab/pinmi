import React, {useState, useEffect} from 'react';
// Components
import Notetaking from '../Notetaking';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Button, Box } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popper from '@material-ui/core/Popper';

import { useActiveStepValue } from '../../context';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  imageIcon: {
    height: '100%'
  },
  iconRoot: {
    textAlign: 'center'
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  }
}));

const DisscussionPrep = () => {
  const classes = useStyles();
  const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();
  const [curPinIndex, setCurPinIndex] = useState(-1);
  useEffect(() => {
    window.scrollTo(0,0);
  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={2}>
          <AudioReview 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
          />
          <Transcription />
          <Notetaking 
            curPinIndex = {curPinIndex}/>
        </Grid>
      </Container>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box m={2}>
            <Button 
          variant="contained"
          onClick={handleClickOpen}>
        Join Discussion
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to join the discussion?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          Add more notes to pins
          </Button>
          <Button onClick={handleNext} color="primary" autoFocus>
          Join Discussion
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
            </div>
    </div>
  );
};

export default DisscussionPrep;