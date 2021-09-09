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

import ColorLibButton from './layout/ColorLibComponents/ColorLibButton';
import { ColorLibNextButton, ColorLibCallEndButton } from './layout/ColorLibComponents/ColorLibButton';

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

function VideoChatComponentSecond(props) {
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
  const {setMediaDuration , setMediaUrl} = useSessionValue();
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

    await firebase.firestore().collection("Pins").doc(formatTime(curTime)).set({
        pinID,
        pinTime: curTime,
        // pinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
        sessionID: MiTrainingSessionID,
        callerPinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
        calleePinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
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
        What did you learn from today’s discussion?
          <br />
          <br />
          Be sure to thank your peer for their time!
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
    }) 
    .catch((error) => {console.log(error)});
  }

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(props.isArchiveHost) {
      //setting mediaDuration to be used in AudioReview
      //setMediaDuration(Math.floor((Date.now() - videoCallTimer) / 1000));
      //props.stopRec();
      console.log("stop recording");
    }
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
                <DialogTitle id="alert-dialog-title">{"You have discussed 2 out of 3 pins."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>Are you sure you want to finish discussing pins?</p>
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
                    Continue with Discussion
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
                    Finish Discussing pins
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
        
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 50px 0'}}>
        <ColorLibCallEndButton 
          variant="contained"
          size="medium"
          onClick={handleNext}
        >
          Begin Self-Reflection
        </ColorLibCallEndButton>
      </div>
      </div>
    </>
  );
}

export default VideoChatComponentSecond;