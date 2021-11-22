import React, {useState} from 'react';
// Components
import DissResponse from '../DissResponse';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import { useSessionValue, useActiveStepValue } from "../../context";

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
  },
  grid: {
    "& .MuiGrid-item": {
      display: 'inline-grid',
    },
    "& .MuiGrid-grid-sm-4": {
      position: 'relative',
      margin: '8px',
      maxWidth: 'calc(33.333333% - 8px)',
      "& .MuiPaper-root": {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: 'scroll',
      }
    },
    "& .MuiGrid-grid-sm-8": {
      maxWidth: 'calc(66.666667% - 8px)',
    }
  },
}));

const Collaboration = ({curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex}) => {
  const classes = useStyles();
  const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();

  // const [room, setRoom] = useState("hello");
  //   //const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
  //   const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  //   const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  //   const [token, setToken] = useState("YOUR_TOKEN");
  //   const [readyMessage, setReadyMessage] = useState("video is not ready");
  //   const isRecording = false;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth='md'>
        <Grid container spacing={2} className={classes.grid}>
          <AudioReview 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
            prevPinIndex = {prevPinIndex}
            setPrevPinIndex = {setPrevPinIndex}
          />
          <Transcription />
          <DissResponse 
            curPinIndex = {curPinIndex}
            setCurPinIndex = {setCurPinIndex}
            prevPinIndex = {prevPinIndex}
            setPrevPinIndex = {setPrevPinIndex}
          />
        </Grid>
      </Container>
    </div>
  );
};

export default Collaboration;