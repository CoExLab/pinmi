import React, { useState, useEffect } from "react";
// Components
import Notetaking from "../Notetaking";
import AudioReview from "../AudioReview";
import Transcription from "../Transcription";
// Others
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";

import ColorLibTimeReminder from "./ColorLibComponents/ColorLibTimeReminder";
import ColorLibButton from "./ColorLibComponents/ColorLibButton";
import { useActiveStepValue, usePinsValue, usePlayerModeValue } from "../../context";
import { firebase } from "../../hooks/firebase";
import { useSelector } from "react-redux";

import { formatTime } from "../../helper/index";

import SinglePlayerVideo from "./SinglePlayerComponents/SinglePlayerDissPrep";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  imageIcon: {
    height: "100%",
  },
  iconRoot: {
    textAlign: "center",
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  },
  grid: {
    "& .MuiGrid-item": {
      display: "inline-grid",
    },
    "& .MuiGrid-grid-sm-4": {
      position: "relative",
      margin: "8px",
      maxWidth: "calc(33.333333% - 8px)",
      "& .MuiPaper-root": {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: "scroll",
      },
    },
    "& .MuiGrid-grid-sm-8": {
      maxWidth: "calc(66.666667% - 8px)",
    },
  },
  tealText: {
    color: theme.palette.teal.main,
  },
}));

const DisscussionPrep = () => {
  const classes = useStyles();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } =
    useActiveStepValue();

  const [prevPinIndex, setPrevPinIndex] = useState(0);
  const [finishedUpdates, setFinishedUpdates] = useState(false);
  const { pins } = usePinsValue();
  //const { sessionID } = useSessionValue();
  const session = useSelector((state) => state.session);
  const user = useSelector((state) => state.user);

  const [curPinIndex, setCurPinIndex] = useState(() => {
    //console.log(pins);
    if (pins.length > 0) {
      return 0;
    } else {
      return -1;
    }
  });

  const [startTime, setStartTime] = useState(Date.now());
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime);
  const [timeRemind, setTimeRemind] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { playerMode } = usePlayerModeValue();

  useEffect(() => {
    console.log("current pin index:", curPinIndex);
    console.log(pins);
    if (finishedUpdates) {
      //save all pins to database and move to next module
      pins.forEach((elem, id) => savePin(id));
      //return Loading module
      setActiveStep(activeStep + 1);
    }
  }, [finishedUpdates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countDown > 0) {
        const timePassed = (Date.now() - startTime) / 1000;
        if (timePassed >= recommendedTime) {
          setCountDown(0);
          setTimeRemind(true);
        } else {
          setCountDown(recommendedTime - timePassed);
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  const savePin = async (index) => {
    const myPin = pins[index];
    console.log(myPin);
    if (user.userMode === "callee") {
      await firebase
        .firestore()
        .collection("sessions")
        .doc(session.sessionID)
        .collection("pins")
        .doc(myPin.pinID)
        .update({
          calleePinNote: myPin.calleePinNote,
          calleePinPerspective: myPin.calleePinPerspective,
          calleePinCategory: myPin.calleePinCategory,
          calleePinSkill: myPin.calleePinSkill,
        })
        .then(() => {
          console.log("current pin successfully updated");
        })
        .catch((e) => {
          console.log("pin update unsuccessful: " + e);
        });
    } else {
      await firebase
        .firestore()
        .collection("sessions")
        .doc(session.sessionID)
        .collection("pins")
        .doc(myPin.pinID)
        .update({
          callerPinNote: myPin.calleePinNote,
          callerPinPerspective: myPin.calleePinPerspective,
          callerPinCategory: myPin.calleePinCategory,
          callerPinSkill: myPin.calleePinSkill,
        })
        .then(() => {
          console.log("current pin successfully updated");
        })
        .catch((e) => {
          console.log("pin update unsuccessful: " + e);
        });
    }
  };

  const handleNext = async () => {
    console.log("Pins changed in dis prep: " + curPinIndex);
    //reset curPinIndex to force the Notetaking.js file to remember the last pin info
    setPrevPinIndex(curPinIndex);
    if (curPinIndex === 0) {
      setCurPinIndex(curPinIndex + 1); //MAIN ISSUE!!!!!
    } else {
      setCurPinIndex(0);
    }
    //allow next step in logic to occur
    setFinishedUpdates(true);
  };

  // useEffect(() => {
  //   console.log(curPinIndex);
  //   console.log(pins);
  //   if (finishedUpdates) {
  //     //save all pins to database and move to next module
  //     pins.map((elem, id) => savePin(id));
  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   }
  // }, [finishedUpdates]);

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <div
          id="time_reminder"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            marginTop: "10px",
            marginRight: "10px",
            zIndex: 100,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">Recommended time left</Typography>
          <Typography variant="h4" className={classes.tealText}>
            {formatTime(countDown)}
          </Typography>
        </div>
        <ColorLibTimeReminder
          open={timeRemind}
          setOpen={setTimeRemind}
          recommendedMinutes={recommendedTime / 60}
          nextSection="Discussion"
        />
        <Grid container spacing={2} className={classes.grid}>
          {playerMode == "multiplayer" ? (
            <>
              <AudioReview
                curPinIndex={curPinIndex}
                setCurPinIndex={setCurPinIndex}
                prevPinIndex={prevPinIndex}
                setPrevPinIndex={setPrevPinIndex}
              />
              <Transcription />
              <Notetaking
                curPinIndex={curPinIndex}
                setCurPinIndex={setCurPinIndex}
                prevPinIndex={prevPinIndex}
                setPrevPinIndex={setPrevPinIndex}
              />
            </>
          ) : (
            <SinglePlayerVideo
              curPinIndex={curPinIndex}
              setCurPinIndex={setCurPinIndex}
              prevPinIndex={prevPinIndex}
              setPrevPinIndex={setPrevPinIndex}
            />
          )}
        </Grid>
      </Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px 0 50px 0",
        }}
      >
        <ColorLibButton variant="contained" size="medium" onClick={handleNext}>
          Join Discussion
        </ColorLibButton>
      </div>
    </div>
  );
};

export default DisscussionPrep;
