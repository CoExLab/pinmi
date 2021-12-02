import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Button, LinearProgress, Box } from "@material-ui/core";
import { Icon, Fab } from "@material-ui/core";
import pin from "../../../other/pin.svg";
import useSpeechToText from "../../transcript";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  ColorLibNextButton,
  ColorLibCallEndButton,
} from "../ColorLibComponents/ColorLibButton";

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
}));

function SinglePlayerVideoChat(props) {
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } =
    useActiveStepValue();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const player = useRef(null);
  const handleProgress = (state) => {
    setAudioProgress(Math.round(state.playedSeconds));
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePinButtonClick = () => {
    var pinTime = Math.floor((Date.now() - videoCallTimer) / 1000);
    console.log("added a pin");
    addPin(pinTime);
  };

  const openPopper = Boolean(anchorEl);
  const id = openPopper ? "simple-popper" : undefined;

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
    setIsStreamSubscribed(isSubscribed);
  }, [isSubscribed]);

  //get setter for media duration
  const { sessionID, setMediaDuration, setMediaUrl } = useSessionValue();
  // fetch raw pin data here
  const { pins } = usePinsValue();

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

    console.log("Finished pushing");
  };

  const addTranscript = async () => {
    await firebase
      .firestore()
      .collection("sessions")
      .doc(sessionID)
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
    resultsArr,
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
        <ReactPlayer
          playing={!loadingStatus}
          ref={player}
          url="https://www.dropbox.com/s/jhlf09qloi62k6h/pin_vid.mov?dl=0"
          width="100%"
          height="100%"
          onProgress={handleProgress}
        />
        <Fab
          aria-describedby={id}
          type="button"
          color="default"
          aria-label="addPin"
          className="pin-Btn"
          onClick={() => {
            handlePinButtonClick();
          }}
        >
          <Icon classes={{ root: classes.iconRoot }}>
            <img className={classes.imageIcon} src={pin} alt="" />
          </Icon>
        </Fab>
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
    console.log(singlePlayerSessionID);
    // await firebase
    //   .firestore()
    //   .collection("singleplayer_media")
    //   .get()
    //   .then((doc) => {
    //     const SPSessionArr = [];
    //     doc.forEach((d) => {
    //       SPSessionArr.push(d.data());
    //     });
    //     SPSessionArr.sort((a, b) => (a.view_count > b.view_count && 1) || -1);
    //     setSinglePlayerSessionID(SPSessionArr[0]);
    //   });

    //   await firebase
    //   .firestore()
    //   .collection("singleplayer_media")
    //   .doc()
    //   .get()
    //   .then((doc) => {
    //     const SPSessionArr = [];
    //     doc.forEach((d) => {
    //       SPSessionArr.push(d.data());
    //     });
    //     SPSessionArr.sort((a, b) => (a.view_count > b.view_count && 1) || -1);
    //     setSinglePlayerSessionID(SPSessionArr[0]);
    //   });

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
        startSpeechToText();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFinishChat = async () => {
    setIsInterviewStarted(false);
    if (props.isArchiveHost) {
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
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStartArchive = async () => {
    //create json to send as the body for post
    const data = {
      sessionId: sessionId,
      resolution: "640x480",
      outputMode: "composed",
      hasVideo: "false",
    };
    //send post request to server
    await fetch(baseURL + "archive/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      //get response from the post request,
      //and turn it into json so you can access data from it
      .then((response) => response.json())
      .then((archiveData) => {
        console.log(archiveData);
        setArchiveData(archiveData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStopArchive = async () => {
    var url = baseURL + "archive/" + archiveData.id + "/stop";
    await fetch(url, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  };

  const getLastestArchive = async () => {
    let url = "https://pin-mi-node-server.herokuapp.com/" + "archive";
    await fetch(url)
      .then((res) => {
        return res.json();
        //return archives[archives.length - 1];
      })
      .then((arc) => {
        let latestArc = arc[arc.length - 1];
        console.log(latestArc.duration);
        console.log(latestArc.url);
        setMediaDuration(latestArc.duration);
        setMediaUrl(latestArc.url);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //if status is available and if timing checks out, and if session id is correct
  const saveArchiveURL = async () => {
    if (props.isArchiveHost) {
      let url = baseURL + "archive/" + archiveData.id;
      await fetch(url)
        .then((res) => res.json()) //return the res data as a json
        .then((res) => {
          setMediaDuration(res.duration);
          setMediaUrl(res.url);
          console.log("Media Duration:", res.duration);
          console.log("Media URL:", res.url);

          setDBMediaURL(res);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      //getLastestArchive()
    }
  };

  const setDBMediaURL = async (res) => {
    await firebase
      .firestore()
      .collection("sessions")
      .doc(sessionID)
      .update({
        media_url: res.url,
        duration: res.duration,
      })
      .then(() => console.log("MediaURL Added to DB"))
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {loadingStatus && (
        <Box pt={10}>
          <LinearProgress />
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"What is pinning for? "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Click on the pin to create time marks of</p>
            <ul>
              <li>situations where you struggled to use MI</li>
              <li>instances of effective MI use</li>
            </ul>
            <p>
              Your peer will also be pinning, and you will review and discuss
              all pins after the client session.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ColorLibNextButton
            variant="contained"
            size="medium"
            onClick={() =>
              handleStartChat(setApiKey, setSessionId, setToken, baseURL)
            }
            autoFocus
          >
            Join Now
          </ColorLibNextButton>
        </DialogActions>
      </Dialog>

      <div className="video-container">
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
