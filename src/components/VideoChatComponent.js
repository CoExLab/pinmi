import React, { useState, useEffect, useRef } from "react";
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
import { Icon, Fab, Popper } from '@material-ui/core';
import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from "@material-ui/core";
import pin from '../other/pin.svg';

import Webcam from "react-webcam";

import pinningClick from "./../other/tutorial/pinning-click.png";

import ColorLibButton, { ColorLibNextButton, ColorLibCallEndButton } from './layout/ColorLibComponents/ColorLibButton';
import ColorLibTimeReminder from './layout/ColorLibComponents/ColorLibTimeReminder';
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

import {
  startSpeechToTextTest,
  stopSpeechToTextTest
} from "./symblAITranscription";

import { baseURL } from './constants';

import { useSessionValue, usePinsValue } from "../context";
import { formatTime } from '../helper/index';
import { firebase } from "../hooks/firebase";


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
  dialog: {
    '& .MuiDialogContentText-root': {
      color: theme.palette.gray.dark,
      display: 'flex',
      '& video': {
        borderRadius: '5px',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
      },
      '& .MuiFab-root': {
        left: 'calc(50% - 50px)',
        width: '45px',
        height: '45px',
        backgroundColor: 'white',
        border: 'solid 1px ' + theme.palette.teal.light,
        '& .MuiSvgIcon-root': {
          fill: theme.palette.teal.dark,
        },
        '&:last-child': {
          marginLeft: '10px',
        }
      }
    }
  }
}));

function VideoChatComponent(props) {
  const pinBtn = useRef(null);

  //get setter for media duration
  const session = useSelector(state => state.session);
  // fetch raw pin data here
  const { pins } = usePinsValue();
  //get user informatoin
  const user = useSelector(state => state.user);

  const [popperContentIndex, setPopperContentIndex] = useState(0);
  const [popperOpen, setPopperOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [buttonDis, setButtonDis] = useState(false);
  const [buttonDisStop, setButtonDisStop] = useState(true);

  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime); // 10 minutes

  var line1 = "situations where you struggled to use MI";
  var line2 = "instances of effective MI use ";
  if (user.userMode === "callee") {
    line1 = "situations where your peer struggled to use MI";
    line2 = "instances of effective MI use by your peer";
  }

  const getPopperContent = (index) => {
    switch (index) {
      case 0:
        return "Don’t forget to pin at least twice";
      case 1:
        const thisPin = pins[pins.length - 1];
        const pinTime = thisPin.pinTime;
        return `Successfully pinned at ${formatTime(pinTime)}`;
      default:
        return "Invalid Pin Content."
    }
  }

  const handlePinButtonClick = async () => {
    console.log("calling handlePinButtonClick");
    console.log("current videoCallTimer:" + videoCallTimer);
    if (videoCallTimer === 0) {
      return;
    }
    if (popperOpen) {
      setPopperOpen(false);
      return;
    }
    var pinTime = Math.floor((Date.now() - videoCallTimer) / 1000);
    console.log("calling addPin from HandlePinButton");
    await addPin(pinTime)
    .then(() => {
      setPopperContentIndex(1);
      setPopperOpen(true);
      setTimeout(() => {
        setPopperOpen(false);
      }, 3000);
      console.log("added a pin");
    });
    
  }

  const [open, setOpen] = useState(true);
  const [timeRemind, setTimeRemind] = useState(false);

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
  const room = session.sessionID;
  //const [baseURL, setBaseURL] = useState("https://pinmi-test-1.herokuapp.com/");
  //const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  //const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  //const [token, setToken] = useState("YOUR_TOKEN");
  const {vonageSessionID, setVonageSessionID, token, setToken, apiKey, setApiKey} = useSessionValue();

  const [loadingStatus, setLoadingStatus] = useState(false);

  const [pinBtnDisabled, setPinBtnDisabled] = useState(false);
  const [pinBtnColor, setPinBtnColor] = useState("");

  //archvieData is the data that is returned in the server response when the archive starts
  const [archiveData, setArchiveData] = useState({});
  //isArchviving is true when the achrive is actively recording
  //const [isArchiving, setIsArchiving] = useState(false);

  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();



  // //ATTEMPT TO PUT API CODE INTO THIS FUNCTION
  // const 


  useEffect(() => {
    console.log("isInterviewStarted changed to", isInterviewStarted);
    isInterviewStarted
      ? initializeSession(apiKey, vonageSessionID, token)
      : stopStreaming();
  }, [isInterviewStarted, apiKey, token, vonageSessionID]);

  //this useEffect occurs when the session.connect() method succeeds in 
  //VonageVideoAPIIntegration
  useEffect(()=>{
    //what do we want to do when the stream connects? 
    //maybe if they are the callee, start the archive here
    console.log("Session has successfully connected");
    // if (isSessionConnected && props.isArchiveHost){
    //   handleStartArchive();
    // }
  }, [isSessionConnected])

  useEffect(() => {
    setIsStreamSubscribed(isSubscribed);
    if (isSubscribed && isSessionConnected && props.isArchiveHost){
      handleStartArchive();
    }
  }, [isSubscribed]);


  //set the videoCallTimer after the archive event has occured 
  useEffect(() => {
    console.log("Hey look! They archive status changed from VCC!!");
    if (isArchiving === true){
      setVideoCallTimer(Date.now());
    } 
  }, [isArchiving])

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
  // const { sessionID, setMediaDuration, setMediaUrl } = useSessionValue();
  // fetch raw pin data here
  // const { pins } = usePinsValue();

  //what is going on with addPinDelayTime????

  const addPin = async (curTime) => {
    console.log("Calling addPin for " + curTime);
    // ui on
    setPinBtnDisabled(true);
    setPinBtnColor("primary");
    // ui off
    setTimeout(() => {
      setPinBtnDisabled(false);
    }, 800);

    if (pins.length > 0 && pins[pins.length - 1].pinTime === curTime) {
      return;
    }

    //create a newPin object to house pin details
    const myPin = {
      pinID: '',
      creatorID: user.userID,
      creatorMode: user.userMode,
      pinTime: curTime,
      callerPinNote: '',
      callerPinPerspective: '',
      callerPinCategory: '',
      callerPinSkill: '',
      calleePinNote: '',
      calleePinPerspective: '',
      calleePinCategory: '',
      calleePinSkill: '',
      pinGoal: '',
      pinStrength: '',
      pinOpportunity: '',
    };

    //Otherwise, use this code, as it will save reads and writes in the long run:
    let docRef = await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").add({
      pinID: '',
      creatorID: myPin.creatorID,
      creatorMode: myPin.creatorMode,
      pinTime: myPin.pinTime,
      callerPinNote: myPin.callerPinNote,
      callerPinPerspective: myPin.callerPinPerspective,
      callerPinCategory: myPin.callerPinCategory,
      callerPinSkill: myPin.callerPinSkill,
      calleePinNote: myPin.calleePinNote,
      calleePinPerspective: myPin.calleePinPerspective,
      calleePinCategory: myPin.calleePinCategory,
      calleePinSkill: myPin.calleePinSkill,
      pinGoal: '',
      pinStrength: '',
      pinOpportunity: '',
    });
    myPin.pinID = docRef.id;
    //update with pinID
    await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").doc(docRef.id).update({
      pinID: myPin.pinID
    })
    pins.push(myPin);
    console.log("Finished pin creation");
  }

  const addTranscript = async (results) => {
    //write the transcript to the database
    //create a space to upload caller and callee transcripts separately
    if (userMode == "callee") {
      await firebase.firestore().collection("sessions").doc(session.sessionID).update({
        calleeTranscript: results
      })
        .then(() => {
          console.log("Callee transcript successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
    else {
      await firebase.firestore().collection("sessions").doc(session.sessionID).update({
        callerTranscript: results
      })
        .then(() => {
          console.log("Caller transcript successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
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
                  <Button>
                    <MicIcon classes={{ root: classes.iconRoot }}
                      onClick={() => onToggleAudio(false)}
                      className="on-icon">
                    </MicIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <Fab size="medium" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <Button color="#616161">
                    <MicOffIcon classes={{ root: classes.iconRoot }}
                      onClick={() => onToggleAudio(true)}
                      className="off-icon">
                    </MicOffIcon>
                  </Button>
                </Fab>
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <Button>
                    <VideocamIcon classes={{ root: classes.iconRoot }}
                      onClick={() => onToggleVideo(false)}
                      className="on-icon">
                    </VideocamIcon>
                  </Button>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                  <Button>
                    <VideocamOffIcon classes={{ root: classes.iconRoot }}
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
                    <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <Button>
                        <VolumeUpIcon classes={{ root: classes.iconRoot }}
                          onClick={() => onToggleAudioSubscription(false)}
                          className="on-icon">
                        </VolumeUpIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <Button>
                        <VolumeOffIcon classes={{ root: classes.iconRoot }}
                          onClick={() => onToggleAudioSubscription(true)}
                          className="off-icon">
                        </VolumeOffIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <Button>
                        <VisibilityIcon classes={{ root: classes.iconRoot }}
                          onClick={() => onToggleVideoSubscription(false)}
                          className="on-icon">
                        </VisibilityIcon>
                      </Button>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <Fab size="medium" color="#36454f" style={{ marginBottom: 10, marginRight: 10, backgroundColor: '#565656' }}>
                      <Button>
                        <VisibilityOffIcon classes={{ root: classes.iconRoot }}
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
        <Fab
          aria-describedby={"addPin"}
          aria-label="addPin"
          type="button"
          color="default"
          className='pin-Btn'
          onClick={() => {
            handlePinButtonClick();
          }}
          ref={pinBtn}
        >
          <Icon classes={{ root: classes.iconRoot }}>
            <img className={classes.imageIcon} src={pin} alt="" />
          </Icon>
        </Fab>
        <Popper
          open={popperOpen}
          anchorEl={pinBtn.current}
          placement='right'
          style={{ zIndex: 3 }}
          transition
        >
          <ColorLibPaper elevation={2}>
            <Typography variant='body2'>
              {getPopperContent(popperContentIndex)}
            </Typography>
          </ColorLibPaper>
        </Popper>
      </>
    );
  };

  const handleStartChat = async (setApiKey, setSessionId, setToken, baseURL) => {
    setOpen(false);
    console.log("loading info now...");
    setLoadingStatus(true);
    if (props.mode === "Discussion") {
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
        //tells the server that the user entered the room. 
        enterRoom(user.userMode, res.sessionId);
      }).then(() => {
        setLoadingStatus(false);
        console.log("start chat now");
        setIsInterviewStarted(true);
        // Disable audio / video buttons as set before
        if (!isAudioEnabled) {
          onToggleAudio(false);
        }
        if (!isVideoEnabled) {
          onToggleVideo(false);
        }
        if (props.isArchiveHost) {
          //props.startRec();
          //console.log("start recording");
        }
      })
      .catch((error) => { console.log(error) });
  }

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    if (props.isArchiveHost){
      handleStopArchive();
    }
    
  
    //letting the server know that the user exited the room
    await exitRoom(user.userMode, vonageSessionID)
       .then(() => {
    //     //const results = stopSpeechToTextTest();
    //     //addTranscript(results);
    //     // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     //call to the parent to move to Loading Page
        props.setNextPage(true); 
       })
       .catch((error) => { console.log(error) });


    //sort the array
    pins.sort(function (a, b) {
      return a.pinTime - b.pinTime;
    });

    console.log(pins);
    if (pins[0]) {
      console.log(pins[0]);
    }
  }

  const handleStartArchive = async () => {
    //create json to send as the body for post
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
        setVideoCallTimer(Date.now());
        console.log(Date.now());

        // Start Symbl AI transcription. Pass in videoCallTimer so we can create time stamps.
        startSpeechToTextTest(Date.now());

        setPopperOpen(true);
        setTimeout(() => {
          if (popperContentIndex === 0) {
            setPopperOpen(false);
          }
        }, 5000);
        setTimeout(() => {
          setPopperOpen(true);
          setPopperContentIndex(0);
        }, recommendedTime / 2 * 1000);
        setTimeout(() => {
          if (popperContentIndex === 0) {
            setPopperOpen(false);
          }
        }, recommendedTime / 2 * 1000 + 5000);

        console.log(archiveData);
        setArchiveData(archiveData);
        setDBArchiveData(archiveData);
      })
      .catch((error) => { console.log(error) })
    setButtonDis(true);
    setButtonDisStop(false);
  }

  const handleStopArchive = async () => {
    var url = baseURL + 'archive/' + archiveData.id + '/stop';
    await fetch(url, {
      method: 'POST',
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        const results = stopSpeechToTextTest();
        console.log(results);
        addTranscript(results);
      })
    setButtonDisStop(true);
  }


  //this function sends a post request to the server
  //to indicate that someone has entered the video room. 
  //userMode is either "callee" or "caller", and 
  const enterRoom = (userMode, sessionID) => {
    
    let url = baseURL + 'enteredRoom/' + userMode+"/"+sessionID;
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
    })
  }
    //this function sends a put request to the server
  //to indicate that someone has exited the video room and gone to the loading page.
  //userMode is either "callee" or "caller", and 
  const exitRoom  = async (userMode, sessionID) => {
  
    let url = baseURL + 'exitedRoom/' + userMode+"/"+sessionID;
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
    })
  }


  const setDBArchiveData = async (archiveData) => {
    await firebase.firestore().collection("sessions").doc(session.sessionID).update({
      archiveData: archiveData
    })
      .then(() => console.log("archiveData Added to DB for :" + session.sessionID))
      .catch((e) => { console.log(e) });
  }

  // const getS3ArchiveURL = async (archiveData) => {
  //   var archiveID = archiveData.id;
  //   url = baseURL + 's3/' + archiveData.id;
  //   await fetch(url)
  //   .then((res) => {
  //     setMediaUrl(res);
  //   }).catch((e) => { console.log(e) });

  // }

  const PreviewMicButton = () => (
    isAudioEnabled ?
      <Fab>
        <MicIcon
          onClick={() => setIsAudioEnabled(false)}
        />
      </Fab> :
      <Fab>
        <MicOffIcon
          onClick={() => setIsAudioEnabled(true)}
        />
      </Fab>
  );

  const PreviewVideoButton = () => (
    isVideoEnabled ?
      <Fab>
        <VideocamIcon
          onClick={() => setIsVideoEnabled(false)}
        />
      </Fab> :
      <Fab>
        <VideocamOffIcon
          onClick={() => setIsVideoEnabled(true)}
        />
      </Fab>
  );



  return (
    <>
      <Box pt={10}>
        {loadingStatus ? <LinearProgress /> : null}
      </Box>
      <Dialog
        className={classes.dialog}
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ marginRight: '20px', width: 'calc(45% - 20px)' }}>
              <img
                src={pinningClick}
                alt={"Icon of clicking the pin"}
                style={{
                  margin: '20px 0px 10px 0px',
                  height: '80px'
                }}
              />
              <Typography variant='h4'>
                What is pinning for?
              </Typography>
              <Typography variant='body2'>
                <p>Click on the pin to create time marks of</p>
                <ul style={{ fontWeight: 700 }}>
                  <li>{line1}</li>
                  <li>{line2}</li>
                </ul>
                <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
              </Typography>
              <div style={{ marginTop: '20px' }}>
                <ColorLibNextButton
                  variant='contained'
                  size='medium'
                  onClick={
                    () => handleStartChat(setApiKey, setVonageSessionID, setToken, baseURL)
                  }
                  autoFocus
                >
                  Join Now
                </ColorLibNextButton>
              </div>
            </div>
            <div style={{ width: '55%' }}>
              {isVideoEnabled
                ? <Webcam
                  mirrored
                  audio={isAudioEnabled}
                  muted="muted"
                />
                : <div style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'black',
                  borderRadius: '5px'
                }} />}
              <div style={{ marginTop: '-65px' }}>
                <PreviewMicButton />
                <PreviewVideoButton />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
            open={openEnd}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to end this session?"}</DialogTitle>
                <DialogActions>
                <Box m={2}>
                  <div direction='row' align='center'>
                  <ColorLibButton
                    variant='contained'
                    size='medium'
                    onClick={
                      () => setOpenEnd(false)
                    }
                    autoFocus
                  >
                    Continue Session
                  </ColorLibButton>
                  <Box mt={2}>
                  <ColorLibNextButton
                    variant='outlined'
                    size='medium'
                    onClick={() => handleFinishChat()}
                    autoFocus
                  >
                    End Session
                  </ColorLibNextButton>
                  </Box>
                  
                  </div>
                  </Box>
                </DialogActions>
            </Dialog>    

      <ColorLibTimeReminder 
        open={timeRemind} 
        setOpen={setTimeRemind}
        recommendedMinutes={recommendedTime / 60}
        nextSection="Discussion Prep"
      />

      <div className="video-container">
        <div
          id="subscriber"
          className={`${isStreamSubscribed ? "main-video" : "additional-video"
            }`}
        >
          {isStreamSubscribed && renderToolbar()}
        </div>
        <div
          id="publisher"
          className={`${isStreamSubscribed ? "additional-video" : "main-video"
            }`}
        >
          {!isStreamSubscribed && renderToolbar()}
        </div>
      </div>

      <div className='actions-btns'>
        <ColorLibCallEndButton
          variant="contained"
          size="medium"
          onClick={() => setOpenEnd(true)}
          disabled={!isInterviewStarted}
        >
          Begin Discussion Prep
        </ColorLibCallEndButton>
        {props.isArchiveHost ?
          <Button
            onClick={() => handleStartArchive()}
            color='secondary'
            variant="contained"
            disabled={buttonDis}
          >Start Recording
          </Button> :
          <div></div>}
        {props.isArchiveHost ?
          <Button
            onClick={() => handleStopArchive()}
            color='secondary'
            variant="contained"
            disabled={buttonDisStop}
          >Stop Recording
          </Button> :
          <div></div>}


      </div>
    </>
  );
}

export default VideoChatComponent;
