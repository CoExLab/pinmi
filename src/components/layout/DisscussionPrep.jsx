import React, { useState, useEffect } from 'react';
// Components
import Notetaking from '../Notetaking';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

import ColorLibButton from './ColorLibComponents/ColorLibButton';
import { useActiveStepValue, usePinsValue, useSessionValue, useUserModeValue } from '../../context';
import { firebase } from '../../hooks/firebase';
import { formatTime, generatePushId } from '../../helper/index';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  imageIcon: {
    height: '100%'
  },
  iconRoot: {
    textAlign: 'center'
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  },
  grid: {
    "& .MuiGrid-item": {
      display: 'inline-grid',
    },
  },
}));

const DisscussionPrep = () => {
  const classes = useStyles();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();
  const [curPinIndex, setCurPinIndex] = useState(0);
  const [prevPinIndex, setPrevPinIndex] = useState(0);
  const { pins } = usePinsValue();
  const { sessionID } = useSessionValue();
  const { userID } = useUserModeValue();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const savePin = async (index) => {
    const myPin = pins[index];
    console.log(myPin);
    await firebase.firestore().collection("sessions").doc(sessionID).collection("pins").add({
      creatorID: myPin.creatorID,
      creatorMode: myPin.creatorMode,
      pinTime: myPin.pinTime,
      creatorPinNote: myPin.creatorPinNote,
      creatorPinPerspective: myPin.creatorPinPerspective,
      creatorPinCategory: myPin.creatorPinCategory,
      creatorPinSkill: myPin.creatorPinSkill,
      otherPinNote: myPin.otherPinNote,
      otherPinPerspective: myPin.otherPinPerspective,
      otherPinCategory: myPin.otherPinCategory,
      otherPinSkill: myPin.otherPinSkill,
    })
    .then((docRef) => { pins[index].pinID = docRef.id; console.log("current pin successfully updated") })
    .catch((e) => { console.log("pin update unsuccessful: " + e) });
  }

  const handleNext = () => {
    console.log(pins);
    pins.map((elem, id) => savePin(id));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth='md'>
        <Grid container spacing={2} className={classes.grid}>
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
            setPrevPinIndex={setPrevPinIndex} />
        </Grid>
      </Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 50px 0' }}>
        <ColorLibButton
          variant="contained"
          size="medium"
          onClick={handleNext}>
          Join Discussion
        </ColorLibButton>
      </div>
    </div>
  );
};

export default DisscussionPrep;