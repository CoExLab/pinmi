import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Tooltip, Button } from "@material-ui/core";
import { apiKey, sessionId, token } from "./constants";
import { Icon, Fab } from '@material-ui/core';
import pin from '../other/pin.svg';
import { makeStyles } from '@material-ui/core/styles';

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

  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    isInterviewStarted
      ? initializeSession(props.apiKey, props.sessionId, props.token)
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
                <MicIcon
                  onClick={() => onToggleAudio(false)}
                  className="on-icon"
                />
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <MicOffIcon
                  onClick={() => onToggleAudio(true)}
                  className="off-icon"
                />
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <VideocamIcon
                  onClick={() => onToggleVideo(false)}
                  className="on-icon"
                />
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <VideocamOffIcon
                  onClick={() => onToggleVideo(true)}
                  className="off-icon"
                />
              </Tooltip>
            )}
            {isStreamSubscribed && (
              <>
                {isAudioSubscribed ? (
                  <Tooltip title="sound on">
                    <VolumeUpIcon
                      onClick={() => onToggleAudioSubscription(false)}
                      className="on-icon"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <VolumeOffIcon
                      onClick={() => onToggleAudioSubscription(true)}
                      className="off-icon"
                    />
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <VisibilityIcon
                      onClick={() => onToggleVideoSubscription(false)}
                      className="on-icon"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <VisibilityOffIcon
                      onClick={() => onToggleVideoSubscription(true)}
                      className="off-icon"
                    />
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

  const handleStartChat = () => {
    setIsInterviewStarted(true);
    setVideoCallTimer(Date.now());
  }

  return (
    <>          
      <div className='actions-btns'>
      <Button
        onClick={() => handleStartChat()}
        disabled={isInterviewStarted}
        color='primary'
        variant="contained"
      >
        Start chat
      </Button>
      <Button
        onClick={() => setIsInterviewStarted(false)}
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
        </div>
      </div>
    </>
  );
}

export default VideoChatComponent;
