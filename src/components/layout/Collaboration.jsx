import React, {useState} from 'react';
// Components
import DissResponse from '../DissResponse';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Button } from '@material-ui/core';
import VideoChatComponent from '../VideoChatComponent';
import { useSessionValue, useActiveStepValue } from "../../context";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popper from '@material-ui/core/Popper';


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

const Collaboration = () => {
  const classes = useStyles();
  const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();
  const [curPinIndex, setCurPinIndex] = useState(-1);

  const [room, setRoom] = useState("hello");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");
    const isRecording = false;

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
          <DissResponse 
            curPinIndex = {curPinIndex}/>
        </Grid>
      </Container>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Button 
          variant="contained"
          onClick={handleClickOpen}>
        Begin Self-Reflection
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to begin self-reflection?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          You will be ending this call.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          Continue Discussing on Call
          </Button>
          <Button onClick={handleNext} color="primary" autoFocus>
          Begin Self-Reflection
          </Button>
        </DialogActions>
      </Dialog>
            </div>
    </div>
  );
};

export default Collaboration;
