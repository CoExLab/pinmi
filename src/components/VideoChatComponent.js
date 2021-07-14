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
import { apiKey, sessionId, token } from "./constants";
import { Icon, Fab } from '@material-ui/core';
import pin from '../other/pin.svg';

import {
  toggleAudio,
  toggleVideo,
  toggleAudioSubscription,
  toggleVideoSubscription,
  initializeSession,
  stopStreaming,
} from "./VonageVideoAPIIntegration";
import "./VideoChatComponent.scss";


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
  const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  const [token, setToken] = useState("YOUR_TOKEN");

  const [loadingStatus, setLoadingStatus] = useState(false);

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

  const isRecording = props.isRecording;

  // fetch raw pin data here
  const { pins, setPins } = usePins();
  // get document ID
  const pinID = generatePushId();
  // hard-coded sessionID here
  const MiTrainingSessionID = "123";

  const addPin = async (curTime) => {
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
        <Fab color="default" aria-label="addPin" className = 'pin-Btn'
          onClick={() => addPin(Math.floor((Date.now() - videoCallTimer) / 1000))}>                      
          <Icon classes={{ root: classes.iconRoot }}>
              <img className={classes.imageIcon} src={pin} alt="" />
          </Icon>   
        </Fab>
      </>
    );
  };

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
    console.log("loading info now...");
    setLoadingStatus(true);
    await fetch(baseURL)
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
      if(props.isRecording) {
        props.startRec();
        console.log("start recording");
      }
    }) 
    .catch((error) => {console.log(error)});
  }

  const handleFinishChat = () => {
    setIsInterviewStarted(false);
    if(props.isRecording) {
      props.stopRec();
      console.log("stop recording");
    }
  }

  return (
    <>              
      <Box pt = {10}>
        {loadingStatus ? <LinearProgress /> : null}
      </Box>    
      <div className='actions-btns'>
        <Button
          onClick={() => handleStartChat(setApiKey, setSessionId, setToken, baseURL)}
          disabled={isInterviewStarted}
          color='primary'
          variant="contained"
        >
          Start chat
        </Button>
        <Button
          onClick={() => handleFinishChat()}
          disabled={!isInterviewStarted}
          color='secondary'
          variant="contained"
        >
          Finish chat
        </Button>
      </div>
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
          </div> </div>
    </>
  );
}

export default VideoChatComponent;
