//This code file defines the top-level rendering of the Discussion section of the pin-mi app
import { Box, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { firebase } from '../../../storage/firebase';

import Collaboration from './Collaboration';
import ColorLibButton, {
  ColorLibGrayNextButton,
  ColorLibCallEndButton,
} from '../../components/colorLibComponents/ColorLibButton';
import ColorLibPaper from '../../components/colorLibComponents/ColorLibPaper';
import ColorLibTimeReminder from '../../components/colorLibComponents/ColorLibTimeReminder';

import VideoDiscussion from '../../components/video/VideoDiscussion';

import { formatTime } from '../../../helper/helper';

//context
import { useSessionValue, usePinsValue, useActiveStepValue } from '../../../storage/context';

//style
const useStyles = makeStyles(theme => ({
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
      },
    },
  },
}));

//actual export
const Discussion = () => {
  //style
  const classes = useStyles();

  //current page in the Discussion section
  const [page, setPage] = useState(0);

  //session and user information taken from Redux
  const session = useSelector(state => state.session);
  const user = useSelector(state => state.user);

  //local pins array
  const { pins } = usePinsValue();

  //active step states, used to keep track of progress through the pin-mi app
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  //state variable used to switch on and off database information retrieval/pushes
  const [finishedUpdates, setFinishedUpdates] = useState(false);

  const [endVideo, setEndVideo] = useState(false);

  //Pin index states, used to keep track of the current pin edited and the associated info
  const [prevPinIndex, setPrevPinIndex] = useState(0);
  const [curPinIndex, setCurPinIndex] = useState(() => {
    //If there are no pins, the current index should be -1
    if (pins.length > 0) {
      return 0;
    } else {
      return -1;
    }
  });

  //timer information
  const [startTime, setStartTime] = useState(Date.now());
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime);
  const [timeRemind, setTimeRemind] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  //effect that activates when finishedUpdate is changed. if updates are "finished", depending on the current page,
  //pins information is saved to the database and the next page is rendered
  useEffect(() => {
    console.log('before');
    if (finishedUpdates) {
      console.log('after');
      if (page === 1) {
        pins.forEach((elem, id) => savePin(id));
      }
      console.log(page + 1);
      setPage(page + 1);
      setFinishedUpdates(false);
    }
  }, [finishedUpdates]);

  //this effect controls the timer rendering
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

  //This function is used to conditionally render pages within the dicussion section.
  //Page must be an integer between 0 and 2.
  function getConditionalContent(page) {
    switch (page) {
      case 0:
      case 2:
        return <div />;
      case 1:
        return (
          <Collaboration
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />
        );
      default:
        return <div>Unknown</div>;
    }
  }

  //This function is used to conditionally render the type of videocall interface shown to the user
  //Page must be an integer between 0 and 2.
  function getConditionalVideoMode(page) {
    switch (page) {
      case 0:
      case 2:
        return 'VideoDiscussion';
      case 1:
        return 'Discussion';
      default:
        return '';
    }
  }

  //savePin takes in the array index of a pin in the pins array and sends updates to the database based on the
  // pin information that was edited
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
          calleePinGoal: myPin.calleePinGoal,
          calleePinStrength: myPin.calleePinStrength,
          calleePinOpportunity: myPin.calleePinOpportunity,
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
          callerPinGoal: myPin.callerPinGoal,
          callerPinStrength: myPin.callerPinStrength,
          callerPinOpportunity: myPin.callerPinOpportunity,
        })
        .then(() => {
          console.log('current pin successfully updated');
        })
        .catch(e => {
          console.log('pin update unsuccessful: ' + e);
        });
    }
  };

  //This function is used to define button functionality on this page
  //It takes in a variable "finished", that when true, indicates that the Discussion section has been copleted nad that
  //the next section should be loaded. If "finished" is false, then the next page in the Discussion section is loaded
  const handleButton = finished => {
    if (finished) {
      //pin indices are reset to force the last pin to save
      console.log('handlebutton');
      setPrevPinIndex(curPinIndex);
      setCurPinIndex(0);
      //finishedUpdates is set to true to force pin info to be sent to the db
      setFinishedUpdates(true);
      //next section is accessed
      setEndVideo(true);
    } else {
      if (page === 0) {
        //pull pin updates from previous section and from both users
        //loadPins automatically moves to the next page after completion
        loadPins();
      } else if (page === 1) {
        //pin indices are reset to force the last pin to save
        setPrevPinIndex(curPinIndex);
        if (curPinIndex === 0) {
          setCurPinIndex(1);
        } else {
          setCurPinIndex(0);
        }
        //finishedUpdates is set to true to force pin info to be sent to the db
        setFinishedUpdates(true);
      } else {
        setPage(page + 1);
      }
    }
  };

  //loadPins is a function used to sync the local pins array with edits from both users
  //after syncing the pins array, the next page in the section is loaded.
  const loadPins = async () => {
    //empty the pins array
    pins.splice(0, pins.length);
    //pull information from the database into pins
    await firebase
      .firestore()
      .collection('sessions')
      .doc(session.sessionID)
      .collection('pins')
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          pins.push(doc.data());
        });
        //used to properly sort the pins by time
        pins.sort((a, b) => a.pinTime - b.pinTime);
      })
      .then(() => {
        setPage(page + 1);
      })
      .catch(err => console.error('Error in loadPins functions: ', err));
  };

  //function used to conditionally render and determine button behavior in the discussion section
  //page must be a valid integer between 0 and 2
  function getConditionalButton(page) {
    switch (page) {
      case 0:
        return (
          <Box className={classes.videoButton}>
            <ColorLibPaper elevation={2} className={classes.description}>
              <Typography variant="body2">Introduce yourself to your peer, who is also learning MI.</Typography>
              <Typography variant="body2">How did today’s mock client session go?</Typography>
            </ColorLibPaper>
            <ColorLibGrayNextButton variant="contained" size="medium" onClick={() => handleButton(false)}>
              Let's talk about our pins
            </ColorLibGrayNextButton>
          </Box>
        );
      case 1:
        return (
          <Box align="center" m={2} mb={20}>
            <ColorLibButton variant="contained" size="medium" onClick={() => handleButton(false)}>
              Finish Discussing Pins
            </ColorLibButton>
          </Box>
        );
      case 2:
        return (
          <Box className={classes.videoButton}>
            <ColorLibPaper elevation={2} className={classes.description}>
              <Typography variant="body2">What did you learn from today's discussion?</Typography>
              <Typography variant="body2">Be sure to thank your peer for their time!</Typography>
            </ColorLibPaper>
            <ColorLibCallEndButton variant="contained" size="medium" onClick={() => handleButton(true)}>
              {/* Begin Self-Reflection */}
              End Call
            </ColorLibCallEndButton>
          </Box>
        );
      default:
        return <div>Unknown</div>;
    }
  }

  //actual rendering
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
      <VideoDiscussion
        mode={getConditionalVideoMode(page)}
        isArchiveHost={user.userMode === 'callee'}
        endVideoSession={endVideo}
      />
      {getConditionalContent(page)}
      {getConditionalButton(page)}
    </div>
  );
};

export default Discussion;
