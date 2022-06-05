//This code file defines the rendering of the pins page in the Discussion step of the pin-mi app

import React from 'react';
// Components
import DissResponse from './DissResponse';
import AudioReview from '../../components/AudioReview';
import Transcription from '../../components/transcript/Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import { useActiveStepValue } from '../../../storage/context';

//style
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
}));

//actual export
//takes in state variables for the current pin index and the last pin index that was changed in order to
// properly render and save pin information
const Collaboration = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
  //style
  const classes = useStyles();

  //active step states, used to keep track of progress through the pin-mi app
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } = useActiveStepValue();

  //Page rendering
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={2} className={classes.grid}>
          <AudioReview
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />
          <Transcription />

          <DissResponse
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />
        </Grid>
      </Container>
    </div>
  );
};

export default Collaboration;
