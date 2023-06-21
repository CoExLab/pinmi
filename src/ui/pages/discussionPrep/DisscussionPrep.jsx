//This file is the code related to the dicussion prep page in the pin-mi app

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
// Components
import Notetaking from './Notetaking';
import AudioReview from '../../components/AudioReview';
import Transcription from '../../components/transcript/Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography } from '@material-ui/core';

import ColorLibButton, { ColorLibNextButton } from '../../components/colorLibComponents/ColorLibButton';
import { useActiveStepValue, usePinsValue } from '../../../storage/context';
import { firebase } from '../../../storage/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { reset } from '../../../storage/store';

import ColorLibTimeReminder from '../../components/colorLibComponents/ColorLibTimeReminder';

import { formatTime } from '../../../helper/helper';
import { baseURL } from '../../pages/misc/constants';

import { Dialog, Box, DialogTitle, DialogActions } from '@material-ui/core';

// socket.io
// const socket = io.connect(baseURL);

//Style
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  imageIcon: {
    height: '100%',
  },
  iconRoot: {
    textAlign: 'center',
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  },
  grid: {
    '& .MuiGrid-item': {
      display: 'inline-grid',
    },
    '& .MuiGrid-grid-sm-4': {
      position: 'relative',
      margin: '8px',
      maxWidth: 'calc(33.333333% - 8px)',
      '& .MuiPaper-root': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: 'scroll',
      },
    },
    '& .MuiGrid-grid-sm-8': {
      maxWidth: 'calc(66.666667% - 8px)',
    },
  },
  tealText: {
    color: theme.palette.teal.main,
  },
}));

let unsub;

//Actual export
const DisscussionPrep = () => {
  //style
  const classes = useStyles();

  //active step states, used to keep track of progress through the pin-mi app
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  //local pins array
  const { pins } = usePinsValue();

  //Pin index states, used to keep track of the current pin edited and the associated info
  const [prevPinIndex, setPrevPinIndex] = useState(0);
  const [curPinIndex, setCurPinIndex] = useState(() => {
    if (pins.length > 0) {
      return 0;
    } else {
      return -1;
    }
  });

  //state used to determine if all information associated with pins has been updated to the db
  const [finishedUpdates, setFinishedUpdates] = useState(false);

  //session and user information taken from Redux
  const session = useSelector(state => state.session);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  //timer information
  const [startTime, setStartTime] = useState(Date.now());
  const recommendedTime = 10 * 60;
  const [countDown, setCountDown] = useState(recommendedTime);
  const [timeRemind, setTimeRemind] = useState(false);

  // Join Discussion dialog
  const [openJoin, setOpenJoin] = useState(false);
  const handleClose = () => {
    setOpenJoin(false);
  };

  // true if the user has been notified that the other user ended the reflection
  const [notifiedEnding, setNotifiedEnding] = useState(false);
  const [notifyBox, setNotifyBox] = useState(false);

  // effect to start the listener to the database, make sure the effect only happens once
  // note that the field is pre-set in VideoDiscussion file already. It should be false already
  useEffect(() => {
    unsub = firebase
      .firestore()
      .collection('sessions')
      .doc(session.sessionID)
      .onSnapshot(snapshot => {
        // Code here will be performed once the database has an update
        // Perform notice only when other has ended the call and user is calling
        if (snapshot.data().oneUserReflectEnded && !notifiedEnding) {
          setNotifiedEnding(true);
          setNotifyBox(true);
        }
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('pins', pins);
    // socket.emit('join_reflection', { sessionID: session.sessionID });
  }, []);

  //effect used to automatically save pin info to the db and move to next page
  useEffect(() => {
    console.log('current pin index:', curPinIndex);
    console.log(pins);

    if (finishedUpdates) {
      if (session.recordOnly === true) {
        dispatch(reset());
        document.location.href = '/completion';
      } else {
        //save all pins to database and move to next module
        pins.forEach((elem, id) => savePin(id));
        //return Loading module

        setActiveStep(activeStep + 1);
      }
    }
  }, [finishedUpdates]);

  //effect used to adjust the timer
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

  //savePin takes in the array index of a pin and updates the db document associated with that pin with relevant edits
  //index must be a valid integer between 0 and the length of the array
  const savePin = async index => {
    const myPin = pins[index];
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
          callerPinNote: myPin.calleePinNote,
          callerPinPerspective: myPin.calleePinPerspective,
          callerPinCategory: myPin.calleePinCategory,
          callerPinSkill: myPin.calleePinSkill,
        })
        .then(() => {
          console.log('current pin successfully updated');
        })
        .catch(e => {
          console.log('pin update unsuccessful: ' + e);
        });
    }
  };

  //handleJoinDiscussion is called when the user is ready to join the discussion
  const handleJoinDiscussion = async () => {
    // detach listener to db
    unsub();
    // Call has ended, update in the firebase
    await firebase.firestore().collection('sessions').doc(session.sessionID).update({
      oneUserReflectEnded: true,
    });
    console.log('handleJoinDiscussion called');
    //reset curPinIndex to force the Notetaking.js file to remember the last pin info
    setPrevPinIndex(curPinIndex);
    if (curPinIndex === 0) {
      setCurPinIndex(curPinIndex + 1);
    } else {
      setCurPinIndex(0);
    }

    // socket.emit('joinDiscussion', { sessionID: session.sessionID });

    // await joinDiscussion(user.userMode, session.sessionID)
    //   .then(res => {
    //     console.log('send joinDiscussion to server, ', res.json());
    //   })
    //   .catch(e => {
    //     console.error(e);
    //   });

    //allow next step in logic to occur
    setFinishedUpdates(true);
  };

  // socket.on('joinDiscussion', data => {
  //   console.log(data.message);
  // });

  const joinDiscussion = async (userMode, sessionID) => {
    console.log('joinDiscussion', userMode, sessionID);
    let url = baseURL + 'joinDiscussion/' + userMode + '/' + sessionID;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  //actual page rendering
  return (
    <div className={classes.root}>
      {session.recordOnly !== true && (
        <div
          id="time_reminder"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            marginTop: '10px',
            marginRight: '10px',
            zIndex: 100,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">Recommended time left</Typography>
          <Typography variant="h4" className={classes.tealText}>
            {formatTime(countDown)}
          </Typography>
        </div>
      )}
      <Container maxWidth="md">
        <ColorLibTimeReminder
          open={timeRemind}
          setOpen={setTimeRemind}
          recommendedMinutes={recommendedTime / 60}
          nextSection="Discussion"
        />
        <Grid container spacing={2} className={classes.grid}>
          <AudioReview
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />

          {session.recordOnly !== true && (
            <>
              <Transcription />
              <Notetaking
                curPinIndex={curPinIndex}
                setCurPinIndex={setCurPinIndex}
                prevPinIndex={prevPinIndex}
                setPrevPinIndex={setPrevPinIndex}
              />
            </>
          )}
        </Grid>
      </Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 50px 0' }}>
        <ColorLibButton variant="contained" size="medium" onClick={() => setOpenJoin(true)}>
          {session.recordOnly ? 'End Session' : 'Join Discussion'}
        </ColorLibButton>
      </div>
      <div>
        <Dialog
          open={openJoin}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to '}
            {session.recordOnly ? 'end the session?' : 'join the discussion?'}
          </DialogTitle>
          <DialogActions>
            <Box m={4}>
              <div
                // direction="row" align="center"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <ColorLibButton variant="outlined" size="medium" onClick={() => setOpenJoin(false)} autoFocus>
                  {/* Stay in Discussion Prep */}
                  Cancel
                </ColorLibButton>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <ColorLibNextButton variant="contained" size="medium" onClick={() => handleJoinDiscussion()} autoFocus>
                  {/* Begin peer-feedback discussion */}
                  Join Discussion
                </ColorLibNextButton>
              </div>
            </Box>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={notifyBox}
          onClose={() => setNotifyBox(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {
              'Your partner has finished self reflection and is ready to discuss. Click the Join Discussion button below  to begin the discussion. It’s ok if you didn’t finish your notes on all the pins.'
            }
          </DialogTitle>
          <DialogActions>
            <Box m={4}>
              <div
                // direction="row" align="center"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <ColorLibButton variant="outlined" size="medium" onClick={() => setNotifyBox(false)} autoFocus>
                  {/* Stay in role-play */}
                  Cancel
                </ColorLibButton>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <ColorLibNextButton variant="contained" size="medium" onClick={() => handleJoinDiscussion()} autoFocus>
                  {/* Begin peer-feedback discussion */}
                  Join Discussion
                </ColorLibNextButton>
              </div>
            </Box>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DisscussionPrep;
