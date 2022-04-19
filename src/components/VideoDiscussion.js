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
import { Tooltip, Button, LinearProgress, Box, Typography } from "@material-ui/core";
import { Fab } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatTime } from '../helper/index';

import { ColorLibNextButton } from './layout/ColorLibComponents/ColorLibButton';
import ColorLibButton from './layout/ColorLibComponents/ColorLibButton';
import ColorLibPaper from './layout/ColorLibComponents/ColorLibPaper';

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

import { useSessionValue, useActiveStepValue, usePinsValue } from "../context";
import { firebase } from "../hooks/firebase";


//styles used for icons in videocomponent
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
  const { setCurActiveStep: setActiveStep } = useActiveStepValue();

  const [open, setOpen] = useState(true);
  const [timeRemind, setTimeRemind] = useState(false);
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime); // 10 minutes

  const handleClose = () => {
    setOpen(false);
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

  const isSessionConnected = useSelector(
    (state) => state.connection.isSessionConnected
  );
  const isArchiving = useSelector(
    (state) => state.archive.isStreamArchiving
  );

  // needed vonage info
  const [room] = useState("hello1");
  //const [baseURL, setBaseURL] = useState("https://pinmi-test-1.herokuapp.com/");
  // const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  // const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  // const [token, setToken] = useState("YOUR_TOKEN");

  const [loadingStatus, setLoadingStatus] = useState(false);

  //archvieData is the data that is returned in the server response when the archive starts
  const [archiveData, setArchiveData] = useState({});
  //isArchviving is true when the achrive is actively recording

  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();

  //vonage session data set by the server
  const { vonageSessionID, setVonageSessionID, token, setToken, apiKey, setApiKey } = useSessionValue();

  useEffect(() => {
    console.log("isInterviewStarted useEffect has been called: \n" + isInterviewStarted);
    if (isInterviewStarted) {
      initializeSession(apiKey, vonageSessionID, token)
    } else {
      console.log("stopStreaming called")
      stopStreaming();
    }

    // return function cleanup() {
    //   console.log("stopStreaming called")
    //   stopStreaming();
    // };

    // isInterviewStarted
    //   ? initializeSession(apiKey, vonageSessionID, token)
    //   : stopStreaming();
  }, [isInterviewStarted]);

  useEffect(() => {
    setIsStreamSubscribed(isSubscribed);
    if (isSubscribed && isSessionConnected && props.isArchiveHost) {
      handleStartArchive();
    }
  }, [isSubscribed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && countDown > 0 && videoCallTimer !== 0) {
        const timePassed = (Date.now() - videoCallTimer) / 1000;
        if (timePassed >= recommendedTime) {
          console.log("Time passed: " + timePassed);
          setCountDown(0);
          setTimeRemind(true);
        } else {
          setCountDown(recommendedTime - timePassed);
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

    //set the videoCallTimer after the archive event has occured 
    useEffect(() => {
      console.log("Hey look! They archive status changed from VCC!!");
      if (isArchiving === true) {
        setVideoCallTimer(Date.now());
      }
    }, [isArchiving])

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
  // fetch raw pin data here
  const { pins } = usePinsValue();
  const session = useSelector(state => state.session);
  const user = useSelector(state => state.user);


  const readyToJoin = () => {
    pins.forEach((elem, id) => savePin(id));
    handleStartChat(setApiKey, setVonageSessionID, setToken, baseURL)
  }

  const savePin = async (index) => {
    const myPin = pins[index];
    console.log(myPin);
    if (user.userMode === "callee") {
      await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").doc(myPin.pinID).update({
        calleePinNote: myPin.calleePinNote,
        calleePinPerspective: myPin.calleePinPerspective,
        calleePinCategory: myPin.calleePinCategory,
        calleePinSkill: myPin.calleePinSkill,
      })
        .then(() => { console.log("current pin successfully updated") })
        .catch((e) => { console.log("pin update unsuccessful: " + e) });
    } else {
      await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").doc(myPin.pinID).update({
        callerPinNote: myPin.callerPinNote,
        callerPinPerspective: myPin.callerPinPerspective,
        callerPinCategory: myPin.callerPinCategory,
        callerPinSkill: myPin.callerPinSkill,
      })
        .then(() => { console.log("current pin successfully updated") })
        .catch((e) => { console.log("pin update unsuccessful: " + e) });
    }
  }


  const renderToolbar = () => {
    return (
      <>
         {open ? null : (
          <ColorLibPaper
            elevation={2}
            style={{
              width: 'fit-content',
              position: 'absolute',
              top: '23px',
              left: '20px',
              marginLeft: 0,
              padding: '6px 10px',
              zIndex: 2,
            }}
          >
            <Typography variant="body2">
              Recommended time left: {formatTime(countDown)}
            </Typography>
          </ColorLibPaper>
        )}
        {isInterviewStarted && (
          <div className="video-toolbar">
            {isAudioEnabled ? (
              <Tooltip title="mic on">
                <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <MicIcon classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleAudio(false)}
                    className="on-icon">
                  </MicIcon>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <MicOffIcon classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleAudio(true)}
                    className="off-icon">
                  </MicOffIcon>
                </Fab>
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <VideocamIcon classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleVideo(false)}
                    className="on-icon">
                  </VideocamIcon>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <VideocamOffIcon classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleVideo(true)}
                    className="off-icon">
                  </VideocamOffIcon>
                </Fab>
              </Tooltip>
            )}

            {isStreamSubscribed && (
              <>
                {isAudioSubscribed ? (
                  <Tooltip title="sound on">
                    <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <VolumeUpIcon classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleAudioSubscription(false)}
                        className="on-icon">
                      </VolumeUpIcon>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <VolumeOffIcon classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleAudioSubscription(true)}
                        className="off-icon">
                      </VolumeOffIcon>
                    </Fab>
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <VisibilityIcon classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleVideoSubscription(false)}
                        className="on-icon">
                      </VisibilityIcon>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <VisibilityOffIcon classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleVideoSubscription(true)}
                        className="off-icon">
                      </VisibilityOffIcon>
                    </Fab>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        )}
        {/* <Box width='10%'>
        <Card variant='outlined' aria-describedby={id} type="button" color="default" aria-label="addPin" className = 'card' width='100'>
        <CardContent>
        <Typography variant="body2" component="p">
        Introduce yourself to your peer who is also learning MI.

          <br />
          <br />
How did today’s mock client session go?
        </Typography>
      </CardContent>
        </Card>
        </Box> */}
      </>
    );
  };

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
    setOpen(false);
    console.log("loading info now...");
    setLoadingStatus(true);
    //in order to make sure it connects to the correct room
    if (props.mode === "Discussion" || props.mode === "VideoDiscussion") {
      var roomAddOn = "Discussion";
      console.log("Discussion Room Video component")
    }
    else {
      var roomAddOn = "";
    }
    await fetch(baseURL + "room/" + room + roomAddOn)
      .then(function (res) {
        return res.json()
      })
      .then(function (res) {
        console.log("got server info");
        setApiKey(res.apiKey);
        setSessionId(res.sessionId);
        setToken(res.token);
      }).then(() => {
        setLoadingStatus(false);
        console.log("start chat now");
        setIsInterviewStarted(true);
        if (props.isArchiveHost) {
          //props.startRec();
          console.log("start recording");
        }
      })
      .catch((error) => { console.log(error) });
  }

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    if (props.isArchiveHost) {
      console.log("stop recording");
      handleStopArchive();
    }
    
    //this fetches the archive url
    // await saveArchiveURL();
      // .then(() => {
      //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // })
      // .catch((error) => { console.log(error) });
  }


  const handleStartArchive = async () => {
    //create json to send as the body for post
    console.log(vonageSessionID);
    const data = {
      sessionId: vonageSessionID,
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
        console.log("Video Discussion Archive data: ", archiveData);
        setArchiveData(archiveData);
      })
      .catch((error) => { console.log(error) })
  }

  const handleStopArchive = async () => {
    var url = baseURL + 'archive/' + archiveData.id + '/stop';
    console.log(baseURL + 'archive/' + archiveData.id);
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
        let latestArc = arc[arc.length - 1];
        console.log(latestArc.duration);
        console.log(latestArc.url);
        setMediaDuration(latestArc.duration);
        setMediaUrl(latestArc.url);
      })
      .catch((e) => { console.log(e) });
  }

  //if status is available and if timing checks out, and if session id is correct
  const saveArchiveURL = async () => {
    if (props.isArchiveHost) {
      let url = baseURL + 'archive/' + archiveData.id;
      await fetch(url)
        .then(res => res.json()) //return the res data as a json
        .then((res) => {
          console.log(res);
          // setMediaDuration(res.duration);
          // setMediaUrl(res.url);
          console.log("Discussion Media Duration:", res.duration);
          console.log("Discussion Media URL:", res.url);

          setDBMediaURL(res);
        })
        .catch((e) => { console.log(e) });
    }
    else {
      //getLastestArchive()
    }
  }

  const setDBMediaURL = async (res) => {
    await firebase.firestore().collection("MediaURLs").doc("test").set({
      URL: res.url,
      Duration: res.duration
    })
      .then(() => console.log("MediaURL Added to DB"))
      .catch((e) => { console.log(e) });
  }


  //CSSMode are strings that have the CSS classnames 
  //for the respective publisher and subscriber video windows. 
  const videoBox = (CSSMode) => {
    var mainVideoCSSClass = ""
    var secondaryVideoCSSClass = ""
    var class_name = ""

    if (CSSMode == "full") {
      mainVideoCSSClass = "main-video";
      secondaryVideoCSSClass = "additional-video";
      class_name = "video-container"
    }
    else if (CSSMode == "mini") {
      mainVideoCSSClass = "discussion-video-other";
      secondaryVideoCSSClass = "discussion-video-other";
      class_name = "mini-video-container"
    }
    return (
      <>
        {/* <Box pt = {10}>
      {loadingStatus ? <LinearProgress /> : null}
    </Box> */}
        <div className={class_name}>
          <div
            id="subscriber"
            className={`${isStreamSubscribed ? mainVideoCSSClass : ""
              }`}
          >
            {isStreamSubscribed && renderToolbar()}
          </div>
          <div
            id="publisher"
            className={`${isStreamSubscribed ? secondaryVideoCSSClass : mainVideoCSSClass
              }`}
          >
            {!isStreamSubscribed && renderToolbar()}
          </div>
        </div>
      </>
    );
  }
  const dialogBox1 = () => {
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
                  () => handleStartChat(setApiKey, setVonageSessionID, setToken, baseURL)
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
  }

  return (
    <>
      <Box pt={10}>
        {loadingStatus ? <LinearProgress /> : null}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to join the discussion?"}</DialogTitle>
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
                  onClick={readyToJoin}
                  autoFocus
                >
                  Join Discussion
                </ColorLibNextButton>
              </Box>

            </div>
          </Box>
        </DialogActions>
      </Dialog>
      {videoBox(props.mode === "Discussion" ? "mini" : "full")}
      {/* <div className="video-container"> 
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
      </div> */}
      {/* {props.isArchiveHost ? 
        <Button 
          onClick = {() => handleStartArchive()}
          color='secondary'
          variant="contained"
        >Start Recording
        </Button> :
        <div></div>}
        {props.isArchiveHost? 
        <Button 
          onClick = {() => handleFinishChat()}
          color='secondary'
          variant="contained"
        >Stop Recording
        </Button> :
        <div></div>} */}
    </>
  );
}

export default VideoChatComponent;

