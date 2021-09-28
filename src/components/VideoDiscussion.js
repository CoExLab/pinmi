import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import MicIcon from "@material-ui/icons/MicNone";
import MicOffIcon from "@material-ui/icons/MicOffOutlined";
import VideocamIcon from "@material-ui/icons/VideocamOutlined";
import VideocamOffIcon from "@material-ui/icons/VideocamOffOutlined";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Tooltip, Button, LinearProgress, Box, Card, Typography } from "@material-ui/core";
import { Icon, Fab } from '@material-ui/core';
import pin from '../other/pin.svg';
import useSpeechToText from './transcript';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popper from '@material-ui/core/Popper';
import CardContent from '@material-ui/core/CardContent';

import { ColorLibNextButton, ColorLibCallEndButton } from './layout/ColorLibComponents/ColorLibButton';
import ColorLibButton from './layout/ColorLibComponents/ColorLibButton';

import {
  toggleAudio,
  toggleVideo,
  toggleAudioSubscription,
  toggleVideoSubscription,
  initializeSession,
  stopStreaming,
} from "./VonageVideoAPIIntegration";
import "./VideoChatComponent.scss";

import { baseURL } from './constants';

import { useSessionValue, useActiveStepValue } from "../context";
import {formatTime, generatePushId} from '../helper/index';
import { firebase } from "../hooks/firebase";
import { usePins } from '../hooks/index';


const useStyles = makeStyles((theme) => ({
  imageIcon: {
      height: '120%'
  },
  iconRoot: {
      textAlign: 'center'
  },
  fab: {
      marginLeft: 550,
  },    
  display: 'flex',
  '& > * + *': {
    marginLeft: theme.spacing(5),
  },
}));

function VideoChatComponent(props) {
  const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePinButtonClick = () => {
    var pinTime = Math.floor((Date.now() - videoCallTimer) / 1000)
    console.log("added a pin")
    addPin(pinTime);
  }

  const openPopper = Boolean(anchorEl);
  const id = openPopper ? 'simple-popper' : undefined;

  const [open, setOpen] = useState(true);

  const handleClose = () => {
      setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioSubscribed, setIsAudioSubscribed] = useState(true);
  const [isVideoSubscribed, setIsVideoSubscribed] = useState(true);
  const [isStreamSubscribed, setIsStreamSubscribed] = useState(false);
  const isSubscribed = useSelector(
    (state) => state.videoChat.isStreamSubscribed
  );

  // needed vonage info
  const [room, setRoom] = useState("hello");
  //const [baseURL, setBaseURL] = useState("https://pinmi-test-1.herokuapp.com/");
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  const [token, setToken] = useState("YOUR_TOKEN");

  const [loadingStatus, setLoadingStatus] = useState(false);

  const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
  const [pinBtnColor, setPinBtnColor] = useState("");   

  //archvieData is the data that is returned in the server response when the archive starts
  const [archiveData, setArchiveData] = useState({});
  //isArchviving is true when the achrive is actively recording
  const [isArchiving, setIsArchiving] = useState(false);
  
  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();

  
  

  useEffect(() => {
    isInterviewStarted
      ? initializeSession(apiKey, sessionId, token)
      : stopStreaming();
  }, [isInterviewStarted]);

  useEffect(() => {
    setIsStreamSubscribed(isSubscribed);
  }, [isSubscribed]);

  const onToggleAudio = (action) => {
    setIsAudioEnabled(action);
    toggleAudio(action);
  };
  const onToggleVideo = (action) => {
    setIsVideoEnabled(action);
    toggleVideo(action);
  };
  const onToggleAudioSubscription = (action) => {
    setIsAudioSubscribed(action);
    toggleAudioSubscription(action);
  };
  const onToggleVideoSubscription = (action) => {
    setIsVideoSubscribed(action);
    toggleVideoSubscription(action);
  };
  //get setter for media duration
  const {setMediaDuration, sessionID} = useSessionValue();
  // fetch raw pin data here
  const { pins, setPins } = usePins();
  // get document ID
  const pinID = generatePushId();
  // get trans ID
  const transID = generatePushId();
  // hard-coded sessionID here
  const MiTrainingSessionID = "123";
  
  //what is going on with addPinDelayTime????
  const addPinDelayTime = 20;

  const addPin = async (curTime) => {
      // ui on
      setPinBtnDisabled(true);        
      setPinBtnColor("primary");
      // ui off
      setTimeout(() => {
          setPinBtnDisabled(false);
      }, 800);

      // if(curTime > addPinDelayTime){
      //   curTime -= addPinDelayTime;
      // } else{
      //   curTime = addPinDelayTime;
      // }

      await firebase.firestore().collection("sessions").doc(sessionID).collection("pins").add( {
        user_id: '',
        timestamp: formatTime(curTime),
        notes: '',
      })        
    .then( () => {
        setPins([...pins, ]);
    })
    .then(() => {
        console.log("Document successfully written!");    
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });  
    console.log("finished writing")      
    console.log(curTime);  
  }

  const addTranscript = async () => {
    await firebase.firestore().collection("sessions").doc(sessionID).update({
      "transcript": results
    })
    .then( () => {
        setPins([...pins, ]);
    })
    .then(() => {
        console.log("Document successfully written!");    
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });  
    console.log("finished writing transcript")    
  }

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: process.env.REACT_APP_API_KEY,
    speechRecognitionProperties: { interimResults: true },
    timeout: 10000
  });

  if (error) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '100px auto',
          textAlign: 'center'
        }}
      >
        <p>
          {error}
          <span style={{ fontSize: '3rem' }}>🤷‍</span>
        </p>
      </div>
    );
  }


  const renderToolbar = () => {
    return (
      <>
        {isInterviewStarted && (
          <div className="video-toolbar">
            {isAudioEnabled ? (
              <Tooltip title="mic on">
                <Fab size="medium" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                    <MicIcon classes={{root: classes.iconRoot}}
                      onClick={() => onToggleAudio(false)}
                      className="on-icon">
                    </MicIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <Fab size="medium" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                  <Button color="#616161">
                    <MicOffIcon classes={{root: classes.iconRoot}}
                      onClick={() => onToggleAudio(true)}
                      className="off-icon">
                    </MicOffIcon>
                  </Button>
                </Fab>
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                    <VideocamIcon classes={{root: classes.iconRoot}}
                      onClick={() => onToggleVideo(false)}
                      className="on-icon">
                    </VideocamIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                  <Button>
                    <VideocamOffIcon classes={{root: classes.iconRoot}}
                      onClick={() => onToggleVideo(true)}
                      className="off-icon">
                    </VideocamOffIcon>
                  </Button>
                </Fab>
              </Tooltip>
            )}

            {isStreamSubscribed && (
              <>
                {isAudioSubscribed ? (
                  <Tooltip title="sound on">
                    <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VolumeUpIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleAudioSubscription(false)}
                        className="on-icon">
                        </VolumeUpIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VolumeOffIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleAudioSubscription(true)}
                        className="off-icon">
                        </VolumeOffIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VisibilityIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleVideoSubscription(false)}
                        className="on-icon">
                        </VisibilityIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <Fab size="medium" color="#36454f" style={{marginBottom:10, marginRight:10, backgroundColor: '#565656'}}>
                      <Button>
                        <VisibilityOffIcon classes={{root: classes.iconRoot}}
                        onClick={() => onToggleVideoSubscription(true)}
                        className="off-icon">
                        </VisibilityOffIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        )}
        <Box width='10%'>
        <Card variant='outlined' aria-describedby={id} type="button" color="default" aria-label="addPin" className = 'card' width='100'>
        <CardContent>
        <Typography variant="body2" component="p">
        Introduce yourself to Julia, a social worker at UPMC also learning MI.

          <br />
          <br />
How did today’s mock client session go?
        </Typography>
      </CardContent>
        </Card>
        </Box>
      </>
    );
  };

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
    setOpen(false);
    console.log("loading info now...");
    setLoadingStatus(true);
    await fetch(baseURL + "room/" + room)
    .then(function(res) {
      return res.json()
    })
    .then(function(res) {
      console.log("got server info");
      setApiKey(res.apiKey);
      setSessionId(res.sessionId);
      setToken(res.token);
    }).then( () => {

      setLoadingStatus(false);
      console.log("start chat now");
      setIsInterviewStarted(true);
      setVideoCallTimer(Date.now());
      if(props.isArchiveHost) {
        //props.startRec();
        console.log("start recording");
      }
      //pass in videoCallTimer so we can create time stamps
      startSpeechToText(); 
    }) 
    .catch((error) => {console.log(error)});
  }

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    if(props.isArchiveHost) {
      //setting mediaDuration to be used in AudioReview
      setMediaDuration(Math.floor((Date.now() - videoCallTimer) / 1000));
      console.log("stop recording");
    }
    stopSpeechToText();
    // addTranscript();
  }

  const setDBMediaURL = async (res) => {
    await firebase.firestore().collection("MediaURLs").doc("test").set({
      URL: res.url,
      Duration: res.duration
  })
  .then(() => console.log("MediaURL Added to DB"))
  .catch((e) => {console.log(e)});
  }


  
  return (
    <>              
      <Box pt = {10}>
        {loadingStatus ? <LinearProgress /> : null}
      </Box>
      <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to join the discussion?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>You have added notes to 2 out of 3 pins.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Box m={2}>
                  <div direction='row' align='center'>
                  <ColorLibButton
                    variant='contained'
                    size='medium'
                    onClick={
                      () => setOpen(false)
                    }
                    autoFocus
                  >
                    Add more notes to pins
                  </ColorLibButton>
                  <Box mt={2}>
                  <ColorLibNextButton
                    variant='outlined'
                    size='medium'
                    onClick={
                      () => handleStartChat(setApiKey, setSessionId, setToken, baseURL)
                    }
                    autoFocus
                  >
                    Join Discussion
                  </ColorLibNextButton>
                  </Box>
                  
                  </div>
                  </Box>
                </DialogActions>
            </Dialog>    
      
      <div className="video-container"> 
        <div
          id="subscriber"
          className={`${
            isStreamSubscribed ? "main-video" : "additional-video"
          }`}
          >
          {isStreamSubscribed && renderToolbar()}
        </div>
        <div
          id="publisher"
          className={`${
            isStreamSubscribed ? "additional-video" : "main-video"
          }`}
          >
          {!isStreamSubscribed && renderToolbar()}
          </div> 
          </div>
          <div className='actions-btns'>
        
        {props.isArchiveHost ? 
        <Button 
          onClick = {() => handleStartArchive()}
          color='secondary'
          variant="contained"
        >Start Recording
        </Button> :
        <div></div>}
        {props.isArchiveHost? 
        <Button 
          onClick = {() => handleStopArchive()}
          color='secondary'
          variant="contained"
        >Stop Recording
        </Button> :
        <div></div>}
      </div>
    </>
  );
}

export default VideoChatComponent;
