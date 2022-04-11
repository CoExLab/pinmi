import { Box, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { firebase } from '../../hooks/firebase';

import Collaboration from "./Collaboration.jsx"
import ColorLibButton, { ColorLibGrayNextButton, ColorLibCallEndButton } from './ColorLibComponents/ColorLibButton';
import ColorLibPaper from './ColorLibComponents/ColorLibPaper';
import ColorLibTimeReminder from './ColorLibComponents/ColorLibTimeReminder';

import VideoDiscussion from "../VideoDiscussion.js"

import { formatTime } from '../../helper/index';

//context
import { useSessionValue, usePinsValue, useActiveStepValue } from "../../context";

const useStyles = makeStyles((theme) => ({
  tealText: {
    color: theme.palette.teal.main,
  },
  videoButton: {
    position: 'absolute',
    right: '50px',
    bottom: '-150px',
    zIndex: 100,
  },
  description: {
    margin: '30px 0px 30px 50px',
    width: '200px',
    '& > *': {
      '&:not(:first-child)': {
        marginTop: '10px',
      }
    }
  },
}));

const Discussion = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  //const { sessionID } = useSessionValue();
  const session = useSelector(state => state.session);
  const user = useSelector(state => state.user);
  const { pins } = usePinsValue();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  const [finishedUpdates, setFinishedUpdates] = useState(false);

  //If there are no pins, the current index should be -1
  const [curPinIndex, setCurPinIndex] = useState(() => {
    //console.log(pins);
    if (pins.length > 0){
      return 0;
    }
    else{
      return -1;
    }
  });

  const [prevPinIndex, setPrevPinIndex] = useState(0);

  const [startTime, setStartTime] = useState(Date.now());
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime);
  const [timeRemind, setTimeRemind] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page])

  useEffect(() => {
    console.log("before");
    if (finishedUpdates) {
      console.log("after");
      if(page === 1){
        pins.forEach((elem, id) => savePin(id));
      }
      console.log(page + 1);
      setPage(page + 1);
      setFinishedUpdates(false);
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

  function getConditionalContent(page) {
    switch (page) {
      case 0:
      case 2:
        return <div />;
      case 1:
        return <Collaboration curPinIndex={curPinIndex} setCurPinIndex={setCurPinIndex} prevPinIndex={prevPinIndex} setPrevPinIndex={setPrevPinIndex} />;
      default:
        return <div>Unknown</div>;
    }
  }

  function getConditionalVideoMode(page) {
    switch (page) {
      case 0:
      case 2:
        return "VideoDiscussion";
      case 1:
        return "Discussion";
      default:
        return "";
    }
  }

  const savePin = async (index) => {
    const myPin = pins[index];
    console.log(myPin);
    if(user.userMode === "callee") {
      await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").doc(myPin.pinID).update({
        calleePinGoal: myPin.calleePinGoal,
        calleePinStrength: myPin.calleePinStrength,
        calleePinOpportunity: myPin.calleePinOpportunity,
      })
      .then(() => {console.log("current pin successfully updated") })
      .catch((e) => { console.log("pin update unsuccessful: " + e) });
    } else {
      await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").doc(myPin.pinID).update({
        callerPinGoal: myPin.callerPinGoal,
        callerPinStrength: myPin.callerPinStrength,
        callerPinOpportunity: myPin.callerPinOpportunity,
      })
      .then(() => {console.log("current pin successfully updated") })
      .catch((e) => { console.log("pin update unsuccessful: " + e) });
    }
  }


  const handleButton = (finished) => {
    if (finished) {
      console.log("handlebutton");
      setPrevPinIndex(curPinIndex);
      setCurPinIndex(0);
      setFinishedUpdates(true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      if(page === 0) {
        //pull pin updates
        loadPins();
      } else if(page === 1){
        setPrevPinIndex(curPinIndex);
        if(curPinIndex === 0) {
          setCurPinIndex(1);
        } else {
          setCurPinIndex(0);
        }
        setFinishedUpdates(true);
      } else {
        setPage(page + 1);
      }
    }
  }
  
  const loadPins = async () => {
    //empty the pins array
    pins.splice(0, pins.length);
    console.log(pins);
    await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").get()
    .then((snapshot) => {
        snapshot.docs.map(doc => {
        pins.push(doc.data());
        })
        pins.sort((a, b) => a.pinTime - b.pinTime);
    })
    .then(() => {
      setPage(page + 1);
    })
    .catch((err) => console.error("Error in loadPins functions: ", err));
  }

  function getConditionalButton(page, setPage, pins, sessionID) {
    switch (page) {
      case 0:
        return (
          <Box className={classes.videoButton}>
            <ColorLibPaper elevation={2} className={classes.description}>
              <Typography variant='body2'>
                Introduce yourself to your peer, who is also learning MI.
              </Typography>
              <Typography variant='body2'>
                How did today’s mock client session go?
              </Typography>
            </ColorLibPaper>
            <ColorLibGrayNextButton variant='contained' size='medium' onClick={() => handleButton(false)}>
              Let's talk about our pins
            </ColorLibGrayNextButton>
          </Box>
        );
      case 1:
        return (
          <Box align='center' m={2} mb={20}>
            <ColorLibButton variant='contained' size='medium' onClick={() => handleButton(false)}>
              Finish Discussing Pins
            </ColorLibButton>
          </Box>
        );
      case 2:
        return (
          <Box className={classes.videoButton}>
            <ColorLibPaper elevation={2} className={classes.description}>
              <Typography variant='body2'>
                What did you learn from today's discussion?
              </Typography>
              <Typography variant='body2'>
                Be sure to thank your peer for their time!
              </Typography>
            </ColorLibPaper>
            <ColorLibCallEndButton variant='contained' size='medium' onClick={() => handleButton(true)}>
              Begin Self-Reflection
            </ColorLibCallEndButton>
          </Box>
        );
      default:
        return <div>Unknown</div>;
    }
  }
  return (
    <div>
      {/* <div id="time_reminder" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        marginTop: '10px',
        marginRight: '10px',
        zIndex: 100,
        textAlign: 'center',
      }}>
        <Typography variant="body2">
          Recommended time left
        </Typography>
        <Typography variant="h4" className={classes.tealText}>
          {formatTime(countDown)}
        </Typography>
      </div> */}
      <ColorLibTimeReminder 
        open={timeRemind} 
        setOpen={setTimeRemind}
        recommendedMinutes={recommendedTime / 60}
        nextSection="Self Reflection"
      />
      <VideoDiscussion mode = {getConditionalVideoMode(page)} isArchiveHost={user.userMode === "callee"}/>
      {getConditionalContent(page)}
      {getConditionalButton(page, setPage, pins, session.sessionID)}
    </div>
  );
}


export default Discussion;