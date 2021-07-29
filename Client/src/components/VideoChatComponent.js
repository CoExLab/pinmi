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
import { Icon, Fab, CircularProgress } from '@material-ui/core';
import pin from '../other/pin.svg';
import useSpeechToText from './transcript';

import {
  toggleAudio,
  toggleVideo,
  toggleAudioSubscription,
  toggleVideoSubscription,
  initializeSession,
  stopStreaming,
} from "./VonageVideoAPIIntegration";
import "./VideoChatComponent.scss";

import { useSessionValue , useUserModeValue } from "../context";

import {formatTime, generatePushId} from '../helper/index';
import { firebase } from "../hooks/firebase";
import { usePins } from '../hooks/index';

// export const startArchive = async () => {
//   //create json to send as the body for post
//   const data = {
//     sessionId: sessionId,
//     resolution: '640x480',
//     outputMode: 'composed',
//     hasVideo: 'false',
//   };
//   //send post request to server
//   await fetch(baseURL + 'archive/start', {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json"
//     }, 
//     body: JSON.stringify(data)
//   })
//   //get response from the post request, 
//   //and turn it into json so you can access data from it
//   .then(response => response.json())
//   .then((archiveData) => {
//     console.log(archiveData);
//     setArchiveData(archiveData);
//   })
//   .catch((error) => {console.log(error)})
// }

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
  const [baseURL, setBaseURL] = useState("https://pin-mi-node-server.herokuapp.com/");
  const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  const [token, setToken] = useState("YOUR_TOKEN");
  const [archiveData, setArchiveData] = useState({});

  const [loadingStatus, setLoadingStatus] = useState(false);

  const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
  const [pinBtnColor, setPinBtnColor] = useState("");   

  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();

  

  useEffect(() => {
    isInterviewStarted
      ? initializeSession(apiKey, sessionId, token, setArchiveData)
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
  const { setMediaDuration, setMediaUrl } = useSessionValue();
  // get user mode (callee/caller)
  const { userMode } = useUserModeValue();
  // fetch raw pin data here
  const { pins, setPins } = usePins();
  // get document ID
  const pinID = generatePushId();
  // get trans ID
  const transID = generatePushId();
  // hard-coded sessionID here
  const MiTrainingSessionID = "123";

  const addPinDelayTime = 20;

  const addPin = async (curTime) => {
      // ui on
      setPinBtnDisabled(true);        
      setPinBtnColor("primary");
      // ui off
      setTimeout(() => {
          setPinBtnDisabled(false);
      }, 800);

      if(curTime > addPinDelayTime){
        curTime -= addPinDelayTime;
      } else{
        curTime = addPinDelayTime;
      }

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

  const addTranscript = async () => {
    await firebase.firestore().collection("Transcripts").doc("testSessionID").set({
      text: results
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
        <Fab color="default" aria-label="addPin" className = 'pin-Btn'
          onClick={() => addPin(Math.floor((Date.now() - videoCallTimer) / 1000))}>    
          {pinBtnDisabled 
          ? 
          <CircularProgress color={pinBtnColor} /> 
          :                         
          <Icon classes={{ root: classes.iconRoot }}>
              <img className={classes.imageIcon} src={pin} alt="" />
          </Icon>   
          } 
        </Fab>
      </>
    );
  };

  // const startArchive = async () => {
  //   //create json to send as the body for post
  //   const data = {
  //     sessionId: sessionId,
  //     resolution: '640x480',
  //     outputMode: 'composed',
  //     hasVideo: 'false',
  //   };
  //   //send post request to server
  //   await fetch(baseURL + 'archive/start', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     }, 
  //     body: JSON.stringify(data)
  //   })
  //   //get response from the post request, 
  //   //and turn it into json so you can access data from it
  //   .then(response => response.json())
  //   .then((archiveData) => {
  //     console.log(archiveData);
  //     setArchiveData(archiveData);
  //   })
  //   .catch((error) => {console.log(error)})
  // }

  const stopArchive = async () => {
    var url = baseURL + 'archive/'+ archiveData.id + '/stop';
    await fetch(url, {
      method: 'POST', 
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res);

    })
  }

  const viewArchive = async () => {
    var url = baseURL + 'archive/'+ archiveData.id;
    fetch(url)
    .then(res => res.json()) //return the res data as a json
    .then((res) => {
      setMediaUrl(res.url);
      console.log(res.url);
    })
    .catch((e) => {console.log(e)});
  }

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
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
    }).then(() => {
      setLoadingStatus(false);
      console.log("start chat now");
      setIsInterviewStarted(true);
      setVideoCallTimer(Date.now());
      startSpeechToText(); 
    })
    .then(() => {
      if(props.isRecording) {
        console.log("start recording");
      }
    })
    .catch((error) => {console.log(error)});
  }

  const handleFinishChat = () => {
    setIsInterviewStarted(false);
    if(props.isRecording) {
      //setting mediaDuration to be used in AudioReview
      setMediaDuration(Math.floor((Date.now() - videoCallTimer) / 1000));
      stopArchive();
      console.log("stop recording");
    }
    stopSpeechToText();
    addTranscript();
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
        {/* <Button 
          onClick = {() => startArchive()}
          color='primary'
          variant="contained"
        >
          Start archive
        </Button> */}
        <Button 
          onClick = {() => viewArchive()}
          color='primary'
          variant="contained"
        >
          View archive
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
