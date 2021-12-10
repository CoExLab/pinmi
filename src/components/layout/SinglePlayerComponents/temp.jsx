import React, { useState, useEffect, useRef } from "react";

import pinningClick from "../../../other/tutorial/pinning-click.png";
import videoPlay from "../../../other/tutorial/video-play.png";

import ColorLibButton, {
  ColorLibNextButton,
  ColorLibCallEndButton,
} from "../ColorLibComponents/ColorLibButton";
import ColorLibPaper from "../ColorLibComponents/ColorLibPaper";

import "../../VideoChatComponent.scss";

import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Tooltip,
  Button,
  LinearProgress,
  Box,
  Popper,
} from "@material-ui/core";
import { Icon, Fab } from "@material-ui/core";
import pin from "../../../other/pin.svg";
import useSpeechToText from "../../transcript";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { baseURL } from "../../constants";

import {
  useSessionValue,
  useActiveStepValue,
  usePinsValue,
  useSinglePlayerPinsValue,
  useSinglePlayerSessionValue,
} from "../../../context";
import { firebase } from "../../../hooks/firebase";
import ReactPlayer from "react-player";
import { transcriptArr } from "../SinglePlayerModules/config";
import "../../VideoChatComponent.scss";

import { formatTime } from "../../../helper/index";

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    height: "120%",
  },
  iconRoot: {
    textAlign: "center",
  },
  fab: {
    marginLeft: 550,
  },
  display: "flex",
  "& > * + *": {
    marginLeft: theme.spacing(5),
  },
  dialog: {
    "& .MuiDialogContentText-root": {
      color: theme.palette.gray.dark,
      display: "flex",
      "& video": {
        borderRadius: "5px",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
      },
      "& .MuiFab-root": {
        left: "calc(50% - 50px)",
        width: "45px",
        height: "45px",
        backgroundColor: "white",
        border: "solid 1px " + theme.palette.teal.light,
        "& .MuiSvgIcon-root": {
          fill: theme.palette.teal.dark,
        },
        "&:last-child": {
          marginLeft: "10px",
        },
      },
    },
  },
}));

function SinglePlayerVideoChat(props) {
  const pinBtn = useRef(null);

  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } =
    useActiveStepValue();
  //get setter for media duration
  const session = useSelector((state) => state.session);
  const { setMediaDuration, setMediaUrl } = useSessionValue();
  // fetch raw pin data here
  const { pins } = usePinsValue();
  //get user informatoin
  const user = useSelector((state) => state.user);
  //video player
  const player = useRef(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const handleProgress = (state) => {
    setAudioProgress(Math.round(state.playedSeconds));
  };

  const [openWarning, setOpenWarning] = useState(false);

  const [popperContentIndex, setPopperContentIndex] = useState(0);
  const [popperOpen, setPopperOpen] = useState(false);

  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime); // 10 minutes

  const getPopperContent = (index) => {
    switch (index) {
      case 0:
        return "Don’t forget to pin at least twice";
      case 1:
        const thisPin = singlePlayerPins[singlePlayerPins.length - 1];
        const pinTime = thisPin.pinTime;
        const pinCreatorMode = thisPin.creatorMode;
        console.log(pinCreatorMode, user.userMode);
        return `Successfully pinned at ${formatTime(pinTime)}`;
      default:
        return "Invalid Pin Content.";
    }
  };

  const handlePinButtonClick = () => {
    if (videoCallTimer === 0) {
      return;
    }
    if (popperOpen) {
      setPopperOpen(false);
      return;
    }
    var pinTime = Math.floor((Date.now() - videoCallTimer) / 1000);
    console.log("added a pin");
    addPin(pinTime);
    // ui on
    setPinBtnDisabled(true);
    setPinBtnColor("primary");
    // ui off
    setTimeout(() => {
      setPinBtnDisabled(false);
    }, 800);
  };

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
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

  // //ATTEMPT TO PUT API CODE INTO THIS FUNCTION
  // const

  useEffect(() => {
    setIsStreamSubscribed(isSubscribed);
    console.log("STREAM SUBSCRIBED FROM SELECTOR UPDATED");
  }, [isSubscribed]);

  //get setter for media duration
  // const { sessionID, setMediaDuration, setMediaUrl } = useSessionValue();
  // fetch raw pin data here
  // const { pins } = usePinsValue();

  const { singlePlayerPins } = useSinglePlayerPinsValue();
  const { singlePlayerSessionID } = useSinglePlayerSessionValue();
  //what is going on with addPinDelayTime????
  const addPinDelayTime = 20;

  const binarySearch = (arr, l, r, x) => {
    console.log(arr, l, r, x);
    if (r >= l) {
      let mid = l + Math.floor((r - l) / 2);

      // If the element is present at the middle
      // itself
      if (
        arr[mid] == x ||
        mid + 1 >= arr.length ||
        (arr[mid] <= x && arr[mid + 1] > x)
      )
        return mid;

      // If element is smaller than mid, then
      // it can only be present in left subarray
      if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);

      // Else the element can only be present
      // in right subarray
      return binarySearch(arr, mid + 1, r, x);
    }

    // We reach here when element is not
    // present in array
    return -1;
  };

  const getTimeStamp = (transcriptArr) => {
    return (
      transcriptArr &&
      transcriptArr.map((transcriptString) => {
        var index = transcriptString.indexOf("-");
        if (index) {
          var tempTimeSeconds = Math.floor(
            parseInt(transcriptString.slice(0, index), 10) / 1000
          );

          return tempTimeSeconds;
        }
      })
    );
  };
  const addPin = async (curTime) => {
    if (
      singlePlayerPins.length > 0 &&
      singlePlayerPins[singlePlayerPins.length - 1].pinTime == curTime
    ) {
      return;
    }

    const ts = getTimeStamp(transcriptArr);
    const TSIndex = binarySearch(ts, 0, ts.length, curTime);
    console.log(TSIndex);

    singlePlayerPins.push({
      pinID: "",
      creatorID: "",
      creatorMode: "",
      pinTime: curTime,
      callerPinNote: "",
      callerPinPerspective: "",
      callerPinCategory: "",
      callerPinSkill: "",
      calleePinNote: "",
      calleePinPerspective: "",
      calleePinCategory: "",
      calleePinSkill: "",
      pinEfficacy: "",
      pinGoal: "",
      pinStrength: "",
      pinOpportunity: "",
      transcriptindex: TSIndex,
    });

    setPopperContentIndex(1);
    setPopperOpen(true);
    setTimeout(() => {
      setPopperOpen(false);
    }, 3000);

    console.log("Finished pushing");
  };

  const addTranscript = async () => {
    //write the transcript to the database
    await firebase
      .firestore()
      .collection("sessions")
      .doc(session.sessionID)
      .update({
        transcript: results,
      })
      .then(() => {
        console.log("Transcript successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: process.env.REACT_APP_API_KEY,
    speechRecognitionProperties: { interimResults: true },
    timeout: 10000,
  });

  if (error) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <p>
          {error}
          <span style={{ fontSize: "3rem" }}>🤷‍</span>
        </p>
      </div>
    );
  }

  const renderToolbar = () => {
    return (
      <>
        {isInterviewStarted && (
          <ReactPlayer
            playing={isInterviewStarted}
            ref={player}
            url="https://www.dropbox.com/s/jhlf09qloi62k6h/pin_vid.mov?dl=0"
            width="100%"
            height="100%"
            onProgress={handleProgress}
          />
        )}
        <Fab
          aria-describedby={"addPin"}
          aria-label="addPin"
          type="button"
          color="default"
          className="pin-Btn"
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
          placement="right"
          style={{ zIndex: 3 }}
          transition
        >
          <ColorLibPaper elevation={2}>
            <Typography variant="body2">
              {getPopperContent(popperContentIndex)}
            </Typography>
          </ColorLibPaper>
        </Popper>
      </>
    );
  };

  const handleStartChat = async (
    setApiKey,
    setSessionId,
    setToken,
    baseURL
  ) => {
    setOpen(false);
    console.log("loading info now...");
    setLoadingStatus(true);
    if (props.mode == "Discussion") {
      var roomAddOn = "Discussion";
      console.log("Discussion Room Video component");
    } else {
      var roomAddOn = "";
    }
    await fetch(baseURL + "room/" + room + roomAddOn)
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        console.log("got server info");
        setApiKey(res.apiKey);
        setSessionId(res.sessionId);
        setToken(res.token);
      })
      .then(() => {
        setLoadingStatus(false);
        console.log("start chat now");
        setIsInterviewStarted(true);
        setVideoCallTimer(Date.now());
        if (props.isArchiveHost) {
          //props.startRec();
          console.log("start recording");
        }
        //pass in videoCallTimer so we can create time stamps
        setPopperOpen(true);
        setTimeout(() => {
          if (popperContentIndex === 0) {
            setPopperOpen(false);
          }
        }, 5000);
        setTimeout(() => {
          setPopperOpen(true);
          setPopperContentIndex(0);
        }, 300000);
        setTimeout(() => {
          if (popperContentIndex === 0) {
            setPopperOpen(false);
          }
        }, 305000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    addTranscript();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    //sort the array
    singlePlayerPins.sort(function (a, b) {
      return a.pinTime - b.pinTime;
    });

    console.log(singlePlayerPins);
    if (singlePlayerPins[0]) {
      console.log(singlePlayerPins[0]);
    }
  };

  return (
    <>
      <Box pt={10}>{loadingStatus ? <LinearProgress /> : null}</Box>
      <Dialog
        className={classes.dialog}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {openWarning ? (
              <div style={{ marginRight: "20px", display: "flex" }}>
                <div>
                  <img
                    src={videoPlay}
                    alt={"Icon of clicking the pin"}
                    style={{
                      margin: "30px 50px 10px 50px",
                      height: "80px",
                    }}
                  />
                </div>
                <div>
                  <Typography variant="h4">Warning</Typography>
                  <Typography variant="body2">
                    <p>
                      You will not be able to pause once you started the video
                      in order to provide a more realistic interviewing
                      experience for you.
                    </p>
                  </Typography>
                  <div style={{ marginTop: "30px" }}>
                    <ColorLibNextButton
                      variant="contained"
                      size="medium"
                      onClick={() =>
                        handleStartChat(
                          setApiKey,
                          setSessionId,
                          setToken,
                          baseURL
                        )
                      }
                      autoFocus
                    >
                      Start Video
                    </ColorLibNextButton>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginRight: "20px" }}>
                <img
                  src={pinningClick}
                  alt={"Icon of clicking the pin"}
                  style={{
                    margin: "20px 0px 10px 0px",
                    height: "80px",
                  }}
                />
                <Typography variant="h4">What is pinning for?</Typography>
                <Typography variant="body2">
                  <p>Click on the pin to create time marks of</p>
                  <ul style={{ fontWeight: 700 }}>
                    <li>situations where you struggled to use MI</li>
                    <li>instances of effective MI use</li>
                  </ul>
                  <p>
                    Your peer will also be pinning, and you will review and
                    discuss all pins after the client session.
                  </p>
                </Typography>
                <div style={{ marginTop: "20px" }}>
                  <ColorLibNextButton
                    variant="contained"
                    size="medium"
                    onClick={() => {
                      setOpenWarning(true);
                      return;
                    }}
                    autoFocus
                  >
                    Next
                  </ColorLibNextButton>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
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

      <div className="actions-btns">
        <ColorLibCallEndButton
          variant="contained"
          size="medium"
          onClick={() => handleFinishChat()}
          disabled={!isInterviewStarted}
        >
          Begin Discussion Prep
        </ColorLibCallEndButton>
      </div>
    </>
  );
}

export default SinglePlayerVideoChat;
