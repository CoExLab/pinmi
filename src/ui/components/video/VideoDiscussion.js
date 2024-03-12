import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/MicNone';
import MicOffIcon from '@material-ui/icons/MicOffOutlined';
import VideocamIcon from '@material-ui/icons/VideocamOutlined';
import VideocamOffIcon from '@material-ui/icons/VideocamOffOutlined';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Tooltip, LinearProgress, Box, Typography } from '@material-ui/core';
import { Fab } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatTime } from '../../../helper/helper';

import { ColorLibNextButton } from '../colorLibComponents/ColorLibButton';
import ColorLibButton from '../colorLibComponents/ColorLibButton';
import ColorLibPaper from '../colorLibComponents/ColorLibPaper';
import { reset } from '../../../storage/store';

import {
  toggleAudio,
  toggleVideo,
  toggleAudioSubscription,
  toggleVideoSubscription,
  initializeSession,
  stopStreaming,
} from './VonageVideoAPIIntegration';
import './VideoChatComponent.scss';

import { baseURL } from '../../pages/misc/constants';

import { useSessionValue, useActiveStepValue, usePinsValue } from '../../../storage/context';
import { firebase } from '../../../storage/firebase';

//styles used for icons in videocomponent
const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: '120%',
  },
  iconRoot: {
    textAlign: 'center',
  },
  fab: {
    marginLeft: 550,
  },
  display: 'flex',
  '& > * + *': {
    marginLeft: theme.spacing(5),
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  welcome_intro: {
    color: theme.palette.teal.dark,
  },
}));

function VideoComponent(props) {
  //active step states, used to keep track of progress through the pin-mi app
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  const session = useSelector(state => state.session);
  const user = useSelector(state => state.user);

  const [open, setOpen] = useState(true);
  const [timeRemind, setTimeRemind] = useState(false);
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime); // 10 minutes

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioSubscribed, setIsAudioSubscribed] = useState(true);
  const [isVideoSubscribed, setIsVideoSubscribed] = useState(true);
  const [isStreamSubscribed, setIsStreamSubscribed] = useState(false);
  const isSubscribed = useSelector(state => state.videoChat.isStreamSubscribed);

  const isSessionConnected = useSelector(state => state.connection.isSessionConnected);
  const isArchiving = useSelector(state => state.archive.isStreamArchiving);

  const room = session.sessionID;

  const [loadingStatus, setLoadingStatus] = useState(false);

  //archvieData is the data that is returned in the server response when the archive starts
  const [archiveData, setArchiveData] = useState({});

  // self-made timer
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const classes = useStyles();

  //vonage session data set by the server
  const { vonageSessionID, setVonageSessionID, token, setToken, apiKey, setApiKey } = useSessionValue();

  let timeout2 = 10;

  useEffect(async () => {
    // Note that this function is modified
    // to directly end the video call
    // it will be redirected to the completion page and disable
    // all camera and audio
    if (props.endVideoSession) {
      setLoading(true);
      if (props.isArchiveHost) {
        await handleStopArchive();
        setLoading(false);
        dispatch(reset());
        document.location.href = '/completion';
      } else {
        await updateDataCopy();
        setLoading(false);
        dispatch(reset());
        document.location.href = '/completion';
      }
    }
  }, [props.endVideoSession]);

  useEffect(() => {
    console.log('isInterviewStarted useEffect has been called: \n' + isInterviewStarted);
    if (isInterviewStarted) {
      initializeSession(apiKey, vonageSessionID, token);
    } else {
      console.log('stopStreaming called');
      stopStreaming();
    }
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
          console.log('Time passed: ' + timePassed);
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
    console.log('Hey look! They archive status changed from VCC!!');
    if (isArchiving === true) {
      setVideoCallTimer(Date.now());
    }
  }, [isArchiving]);

  const onToggleAudio = action => {
    setIsAudioEnabled(action);
    toggleAudio(action);
  };
  const onToggleVideo = action => {
    setIsVideoEnabled(action);
    toggleVideo(action);
  };
  const onToggleAudioSubscription = action => {
    setIsAudioSubscribed(action);
    toggleAudioSubscription(action);
  };
  const onToggleVideoSubscription = action => {
    setIsVideoSubscribed(action);
    toggleVideoSubscription(action);
  };
  //get setter for media duration
  const { setMediaDuration, setMediaUrl } = useSessionValue();
  // fetch raw pin data here
  const { pins } = usePinsValue();

  // Originally "readyToJoin"
  // Now skipping the dialog box, directly begin the discussion
  // useEffect below will call this function directly as the entry point
  const readyToJoin = () => {
    pins.forEach((elem, id) => savePin(id));
    handleStartChat(setApiKey, setVonageSessionID, setToken, baseURL);
  };

  const savePin = async index => {
    const myPin = pins[index];
    console.log(myPin);
    if (user.userMode === 'callee') {
      await firebase
        .firestore()
        .collection('sessions')
        .doc(session.sessionID)
        .collection('pins')
        .doc(myPin.pinID)
        .update({
          calleePinNote: myPin.calleePinNote,
          calleePinPerspective: myPin.calleePinPerspective,
          calleePinCategory: myPin.calleePinCategory,
          calleePinSkill: myPin.calleePinSkill,
        })
        .then(() => {
          console.log('current pin successfully updated');
        })
        .catch(e => {
          console.log('pin update unsuccessful: ' + e);
        });
    } else {
      await firebase
        .firestore()
        .collection('sessions')
        .doc(session.sessionID)
        .collection('pins')
        .doc(myPin.pinID)
        .update({
          callerPinNote: myPin.callerPinNote,
          callerPinPerspective: myPin.callerPinPerspective,
          callerPinCategory: myPin.callerPinCategory,
          callerPinSkill: myPin.callerPinSkill,
        })
        .then(() => {
          console.log('current pin successfully updated');
        })
        .catch(e => {
          console.log('pin update unsuccessful: ' + e);
        });
    }
  };

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
            <Typography variant="body2">Recommended time left: {formatTime(countDown)}</Typography>
          </ColorLibPaper>
        )}
        {isInterviewStarted && (
          <div className="video-toolbar">
            {isAudioEnabled ? (
              <Tooltip title="mic on">
                <Fab
                  size="medium"
                  style={{
                    marginBottom: 10,
                    marginRight: 10,
                    backgroundColor: '#565656',
                  }}
                >
                  <MicIcon
                    classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleAudio(false)}
                    className="on-icon"
                  ></MicIcon>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="mic off">
                <Fab
                  size="medium"
                  style={{
                    marginBottom: 10,
                    marginRight: 10,
                    backgroundColor: '#565656',
                  }}
                >
                  <MicOffIcon
                    classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleAudio(true)}
                    className="off-icon"
                  ></MicOffIcon>
                </Fab>
              </Tooltip>
            )}
            {isVideoEnabled ? (
              <Tooltip title="camera on">
                <Fab
                  size="medium"
                  style={{
                    marginBottom: 10,
                    marginRight: 10,
                    backgroundColor: '#565656',
                  }}
                >
                  <VideocamIcon
                    classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleVideo(false)}
                    className="on-icon"
                  ></VideocamIcon>
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="camera off">
                <Fab
                  size="medium"
                  style={{
                    marginBottom: 10,
                    marginRight: 10,
                    backgroundColor: '#565656',
                  }}
                >
                  <VideocamOffIcon
                    classes={{ root: classes.iconRoot }}
                    onClick={() => onToggleVideo(true)}
                    className="off-icon"
                  ></VideocamOffIcon>
                </Fab>
              </Tooltip>
            )}

            {isStreamSubscribed && (
              <>
                {isAudioSubscribed ? (
                  <Tooltip title="sound on">
                    <Fab
                      size="medium"
                      style={{
                        marginBottom: 10,
                        marginRight: 10,
                        backgroundColor: '#565656',
                      }}
                    >
                      <VolumeUpIcon
                        classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleAudioSubscription(false)}
                        className="on-icon"
                      ></VolumeUpIcon>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="sound off">
                    <Fab
                      size="medium"
                      style={{
                        marginBottom: 10,
                        marginRight: 10,
                        backgroundColor: '#565656',
                      }}
                    >
                      <VolumeOffIcon
                        classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleAudioSubscription(true)}
                        className="off-icon"
                      ></VolumeOffIcon>
                    </Fab>
                  </Tooltip>
                )}
                {isVideoSubscribed ? (
                  <Tooltip title="screen on">
                    <Fab
                      size="medium"
                      style={{
                        marginBottom: 10,
                        marginRight: 10,
                        backgroundColor: '#565656',
                      }}
                    >
                      <VisibilityIcon
                        classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleVideoSubscription(false)}
                        className="on-icon"
                      ></VisibilityIcon>
                    </Fab>
                  </Tooltip>
                ) : (
                  <Tooltip title="screen off">
                    <Fab
                      size="medium"
                      style={{
                        marginBottom: 10,
                        marginRight: 10,
                        backgroundColor: '#565656',
                      }}
                    >
                      <VisibilityOffIcon
                        classes={{ root: classes.iconRoot }}
                        onClick={() => onToggleVideoSubscription(true)}
                        className="off-icon"
                      ></VisibilityOffIcon>
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
    console.log('loading info now...');
    setLoadingStatus(true);
    //in order to make sure it connects to the correct room
    if (props.mode === 'Discussion' || props.mode === 'VideoDiscussion') {
      var roomAddOn = 'Discussion';
      console.log('Discussion Room Video component');
    } else {
      var roomAddOn = '';
    }
    await fetch(baseURL + 'room/' + room + roomAddOn)
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        console.log('got server info');
        setApiKey(res.apiKey);
        setSessionId(res.sessionId);
        setToken(res.token);
      })
      .then(() => {
        setLoadingStatus(false);
        console.log('start chat now');
        setIsInterviewStarted(true);
        if (props.isArchiveHost) {
          //props.startRec();
          console.log('start recording');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      //get response from the post request,
      //and turn it into json so you can access data from it
      .then(response => response.json())
      .then(async archiveData => {
        console.log('Video Discussion Archive data: ', archiveData);
        setArchiveData(archiveData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //save discussion archive url to firebase only when the archive is succesfully uploaded in server
  const pingServer = async () => {
    let status;
    let result = await fetch(baseURL + 's3/' + archiveData.id)
      .then(res => {
        status = res.status;
        return res.json();
      })
      .then(async data => {
        if (status === 503) {
          console.log('Status 503!');
        }
        if (data.arcStatus === 'uploaded') {
          setMediaUrl(data.url);
          setMediaDuration(data.duration);

          await firebase
            .firestore()
            .collection('sessions')
            .doc(session.sessionID)
            .update({
              ['archiveData.reviewURL']: data.url,
            });

          return data.url;
        } else {
          timeout2 = timeout2 * 2;
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve(pingServer()), timeout2);
          });
        }
      })
      .catch(err => {
        console.error('Error in checking if archive is ready ', err);

        //try calling the server again if there is a 503 error
        timeout2 = 10; //reset the timeout
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(pingServer()), timeout2);
        });
      });
    return result;
  };

  // copy all information from "sessions" to "sessions_by_usernames" in firebase
  //the function takes in the discussion archive url
  const updateDataCopy = async url => {
    //source database
    let docRef = await firebase.firestore().collection('sessions').doc(session.sessionID);

    docRef.get().then(async doc => {
      let res = doc.data().datacopy_id;
      let username = props.isArchiveHost ? doc.data().callee_name : doc.data().caller_name;

      if (!res) {
        console.log('data copy destination id does not exist');
      } else {
        console.log('data copy destination id: ', res);
      }

      //destintion database
      let newDoc = await firebase
        .firestore()
        .collection('sessions_by_usernames')
        .doc(username)
        .collection('sessions')
        .doc(res);

      //copy discussion session url to respective caller's collection
      //since only the callee has archive URL of the discussion session
      let callerDoc = await firebase
        .firestore()
        .collection('sessions_by_usernames')
        .doc(doc.data().caller_name)
        .collection('sessions')
        .doc(res);

      newDoc
        .get()
        .then(res => {
          if (props.isArchiveHost) {
            callerDoc.update({
              ['archiveData.reviewURL']: url,
            });
            newDoc.set(doc.data());
            newDoc.update({
              ['archiveData.reviewURL']: url,
            });
          } else {
            newDoc.update(doc.data());
          }
        })
        .then(res => {
          docRef
            .collection('pins')
            .get()
            .then(queryPins => {
              queryPins.forEach(d => {
                console.log(d.data());
                newDoc.collection('pins').doc(d.id).set(d.data());
              });
            });
        })
        .then(res => {
          // the following line is disabled
          // it originally leads to the next page, which is a survey
          // setActiveStep(prevActiveStep => prevActiveStep + 1);
        });
    });
  };

  //pause archive, save archive url, copy data to "sessions_by_usernames" in firbase
  const handleStopArchive = async () => {
    var url = baseURL + 'archive/' + archiveData.id + '/stop';
    console.log(baseURL + 'archive/' + archiveData.id);
    await fetch(url, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        return pingServer();
      })
      .then(url => updateDataCopy(url));
  };

  //CSSMode are strings that have the CSS classnames
  //for the respective publisher and subscriber video windows.
  const videoBox = CSSMode => {
    var mainVideoCSSClass = '';
    var secondaryVideoCSSClass = '';
    var class_name = '';

    if (CSSMode === 'full') {
      mainVideoCSSClass = 'main-video';
      secondaryVideoCSSClass = 'additional-video';
      class_name = 'video-container';
    } else if (CSSMode === 'mini') {
      mainVideoCSSClass = 'discussion-video-other';
      secondaryVideoCSSClass = 'discussion-video-other';
      class_name = 'mini-video-container';
    }

    const containerStyle = CSSMode === 'full' ? { height: '75vh' } : {};

    return (
      <>
        <div className={class_name} style={containerStyle}>
          <div id="subscriber" className={`${isStreamSubscribed ? mainVideoCSSClass : ''}`}>
            {isStreamSubscribed && renderToolbar()}
          </div>
          <div id="publisher" className={`${isStreamSubscribed ? secondaryVideoCSSClass : mainVideoCSSClass}`}>
            {!isStreamSubscribed && renderToolbar()}
          </div>
        </div>
      </>
    );
  };

  // Will directly render the video call page
  // Dialog box in the return has been removed
  useEffect(() => {
    // Function to be called once
    readyToJoin();
  }, []); // Empty dependency array ensures the effect is executed only once

  return (
    <>
      {loading ? (
        <Dialog open={loading} onClose={() => {}}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 10 }}>
            <Typography variant="h1" className={classes.welcome_intro}>
              Saving Discussion Information
            </Typography>
            <Box sx={{ p: 2 }}>
              <CircularProgress />
            </Box>
          </Box>
        </Dialog>
      ) : null}
      <Box pt={10}>{loadingStatus ? <LinearProgress /> : null}</Box>
      {videoBox(props.mode === 'Discussion' ? 'mini' : 'full')}
    </>
  );
}

export default VideoComponent;
