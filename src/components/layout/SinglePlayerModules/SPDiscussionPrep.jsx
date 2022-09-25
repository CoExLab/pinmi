import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

import ColorLibButton from '../ColorLibComponents/ColorLibButton';
import {
  useActiveStepValue,
  useSessionValue,
  usePlayerModeValue,
  useSinglePlayerPinsValue,
  useSinglePlayerSessionValue,
} from '../../../context';
import { useUser } from '../../../context/userContext';
import { firebase } from '../../../hooks/firebase';
import SinglePlayerDissPrep from '../SinglePlayerComponents/SinglePlayerDissPrep';

const useStyles = makeStyles((theme) => ({
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
}));

const SPDisscussionPrep = () => {
  const classes = useStyles();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } =
    useActiveStepValue();
  const [curPinIndex, setCurPinIndex] = useState(0);
  const [prevPinIndex, setPrevPinIndex] = useState(0);
  const [finishedUpdates, setFinishedUpdates] = useState(false);
  const { singlePlayerPins } = useSinglePlayerPinsValue();
  const { sessionID } = useSessionValue();

  const { user: firebaseUser, userSessionId } = useUser();

  useEffect(() => {
    console.log(curPinIndex);
    console.log(singlePlayerPins);
    if (finishedUpdates) {
      //save all pins to database and move to next module
      singlePlayerPins.map((elem, id) => savePin(id));

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [finishedUpdates]);

  const savePin = async (index) => {
    const myPin = singlePlayerPins[index];
    console.log('SAVEPIN');
    console.log(myPin);
    await firebase
      .firestore()
      // .collection("singleplayer")
      // .doc(sessionID)
      // .collection("pins")
      .collection('singleplayer')
      .doc(firebaseUser.uid)
      .collection('sessions')
      .doc(userSessionId)
      .collection('pins')
      .add({
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
        pinEfficacy: '',
        pinGoal: myPin.pinGoal,
        pinStrength: myPin.pinStrength,
        pinOpportunity: myPin.pinOpportunity,
        transcriptindex: myPin.transcriptindex,
      })
      .then((docRef) => {
        singlePlayerPins[index].pinID = docRef.id;
        console.log('current pin successfully updated');
      })
      .catch((e) => {
        console.log('pin update unsuccessful: ' + e);
      });
  };

  const handleNext = async () => {
    console.log('Pins changed in dis prep: ' + curPinIndex);
    //reset curPinIndex to force the Notetaking.js file to remember the last pin info
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(0);
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
      <Container maxWidth='md'>
        <Grid container spacing={2} className={classes.grid}>
          <SinglePlayerDissPrep
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />
        </Grid>
      </Container>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px 0 50px 0',
        }}
      >
        <ColorLibButton variant='contained' size='medium' onClick={handleNext}>
          Join Discussion
        </ColorLibButton>
      </div>
    </div>
  );
};

export default SPDisscussionPrep;
