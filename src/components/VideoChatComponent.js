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
import { Tooltip, Button, LinearProgress, Box } from "@material-ui/core";
import { Icon, Fab } from '@material-ui/core';
import pin from '../other/pin.svg';
import useSpeechToText from './transcript';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popper from '@material-ui/core/Popper';
import Webcam from "react-webcam";

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

import { useSessionValue, useActiveStepValue, usePinsValue, useUserModeValue } from "../context";
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
  //get setter for media duration
  const {sessionID, setMediaDuration , setMediaUrl} = useSessionValue();
  // fetch raw pin data here
  const { pins } = usePinsValue();
  //get user informatoin
  const {userID, userMode} = useUserModeValue();

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

      if(pins.length > 0 && pins[pins.length - 1].pinTime == curTime) {
        return;
      }

      //create a newPin object to house pin details
      const newPin = {
        pinID: '',
        creatorID: userID,
        creatorMode: userMode,
        pinTime: curTime, 
        callerPinNote: '',
        callerPinPerspective: '',
        callerPinCategory: '',
        callerPinSkill: '',
        calleePinNote: '',
        calleePinPerspective: '',
        calleePinCategory: '',
        calleePinSkill: '',
        pinEfficacy: ''
      }; 

      //Use this code if the pins context doesn't work correctly to save pin information from both users
      // await firebase.firestore().collection("sessions").doc(sessionID).collection('pins').add(newPin)
      // .then((docRef) => {
      //   pins.push({
      //     pinID: docRef.id,
      //     pinInfo: newPin
      //   })
      // .then(() => {console.log("New pin successfully written to db");})
      // .catch((err) => {console.error("Error writing pin document ", err);})
      // });

      //Otherwise, use this code, as it will save reads and writes in the long run:
      pins.push(newPin);

      console.log("Finished pin creation"); 
  }

  const addTranscript = async () => {
    //write the transcript to the database
    await firebase.firestore().collection("sessions").doc(sessionID).update({
      transcript: results
    })
    .then(() => {
        console.log("Transcript successfully written!");    
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });  
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
        <Fab aria-describedby={id} type="button" color="default" aria-label="addPin" className = 'pin-Btn'
          onClick={() => {handlePinButtonClick()}}>
          <Icon classes={{ root: classes.iconRoot }}>
              <img className={classes.imageIcon} src={pin} alt="" />
          </Icon>   
        </Fab>
      </>
    );
  };

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
    setOpen(false);
    console.log("loading info now...");
    setLoadingStatus(true);
    if (props.mode == "Discussion"){
      var roomAddOn = "Discussion";
      console.log("Discussion Room Video component")
    }
    else{
      var roomAddOn = "";
    }
    await fetch(baseURL + "room/" + room + roomAddOn)
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
      //setMediaDuration(Math.floor((Date.now() - videoCallTimer) / 1000));
      //props.stopRec();
      console.log("stop recording");
    }
    
    //this fetches the archive url
    await saveArchiveURL()
    .then(() => {
      stopSpeechToText();
      addTranscript();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    })
    .catch((error) => {console.log(error)});

    //sort the array
    pins.sort(function (a, b) {
      return a.pinTime - b.pinTime;
    });

    console.log(pins);
    if(pins[0]){
      console.log(pins[0]);
    }
  }


  const handleStartArchive = async () => {
    //create json to send as the body for post
    const data = {
      sessionId: sessionId,
      resolution: '640x480',
      outputMode: 'composed',
      hasVideo: 'false',
    };
    //send post request to server
    await fetch(baseURL + 'archive/start', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(data)
    })
    //get response from the post request, 
    //and turn it into json so you can access data from it
    .then(response => response.json())
    .then((archiveData) => {
      console.log(archiveData);
      setArchiveData(archiveData);
    })
    .catch((error) => {console.log(error)})
  }

  const handleStopArchive = async () => {
    var url = baseURL + 'archive/'+ archiveData.id + '/stop';
    await fetch(url, {
      method: 'POST', 
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res);
    })
  }

  const getLastestArchive = async () => {
    let url = 'https://pin-mi-node-server.herokuapp.com/' + 'archive'
    await fetch(url)
    .then((res) => {
      return res.json()
      //return archives[archives.length - 1];
    })
    .then((arc) => {
      let latestArc = arc[arc.length-1];
      console.log(latestArc.duration);
      console.log(latestArc.url);
      setMediaDuration(latestArc.duration);
      setMediaUrl(latestArc.url);
    })
    .catch((e) => {console.log(e)});
  }

//if status is available and if timing checks out, and if session id is correct
  const saveArchiveURL = async () => {
    if(props.isArchiveHost) {
      let url = baseURL + 'archive/'+ archiveData.id;
      await fetch(url)
      .then(res => res.json()) //return the res data as a json
      .then((res) => {
        setMediaDuration(res.duration);
        setMediaUrl(res.url);
        console.log("Media Duration:", res.duration);
        console.log("Media URL:", res.url);  
        
        setDBMediaURL(res);
      })
      .catch((e) => {console.log(e)});
    }
    else { 
      //getLastestArchive()
    }
  }

  const setDBMediaURL = async (res) => {
    await firebase.firestore().collection("sessions").doc(sessionID).update({
      media_url: res.url,
      duration: res.duration
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
                <DialogTitle id="alert-dialog-title">{"What is pinning for? "}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Webcam />
                        <p>Click on the pin to create time marks of</p>
                        <ul>
                            <li>situations where you struggled to use MI</li>
                            <li>instances of effective MI use</li>
                        </ul>
                        <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <ColorLibNextButton
                    variant='contained'
                    size='medium'
                    onClick={
                      () => handleStartChat(setApiKey, setSessionId, setToken, baseURL)
                    }
                    autoFocus
                  >
                    Join Now
                  </ColorLibNextButton>
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
        <ColorLibCallEndButton
          variant="contained"
          size="medium"
          onClick={() => handleFinishChat()}
          disabled={!isInterviewStarted}
        >
          Begin Discussion Prep
        </ColorLibCallEndButton>
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
