import { Box, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Collaboration from "./Collaboration.jsx"
import ColorLibButton, { ColorLibGrayNextButton } from './ColorLibComponents/ColorLibButton';
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
  greyNextButton: {
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
  const { sessionID } = useSessionValue();
  const { pins } = usePinsValue();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  const [finishedUpdates, setFinishedUpdates] = useState(false);

  const [curPinIndex, setCurPinIndex] = useState(0);
  const [prevPinIndex, setPrevPinIndex] = useState(0);

  const [startTime, setStartTime] = useState(Date.now());
  const recommendedTime = 13 * 60;
  const [countDown, setCountDown] = useState(recommendedTime);
  const [timeRemind, setTimeRemind] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page])

  useEffect(() => {
    console.log("before");
    if (finishedUpdates) {
      console.log("after");
      setPage(page + 1);
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
        return <div />;
      case 1:
        return <Collaboration curPinIndex={curPinIndex} setCurPinIndex={setCurPinIndex} prevPinIndex={prevPinIndex} setPrevPinIndex={setPrevPinIndex} />;
      default:
        return <div>Unknown</div>;
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
      setPage(page + 1);
    }
  }

  function getConditionalButton(page, setPage, pins, sessionID) {
    switch (page) {
      case 0:
        return (
          <Box className={classes.greyNextButton}>
            <ColorLibPaper elevation={2} className={classes.description}>
              <Typography variant='body2'>
                Introduce yourself to your peer, a social worker at UPMC also learning MI.
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
            <ColorLibButton variant='contained' size='medium' onClick={() => handleButton(true)}>
              Finish Discussing Pins
            </ColorLibButton>
          </Box>
        );
      case 2:
        return;
      default:
        return <div>Unknown</div>;
    }
  }
  return (
    <div>
      <div id="time_reminder" style={{
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
      </div>
      <ColorLibTimeReminder 
        open={timeRemind} 
        setOpen={setTimeRemind}
        recommendedMinutes={recommendedTime / 60}
        nextSection="Self Reflection"
      />
      <VideoDiscussion mode = {page === 0 ? "PreDiscussion" : "Discussion"} discussionState = {1}/>
      {getConditionalContent(page)}
      {getConditionalButton(page, setPage, pins, sessionID)}
    </div>
  );
}


export default Discussion;