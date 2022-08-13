import React, { useEffect, useState } from 'react';
// Components
import DissResponse from './DissResponse';
import AudioReview from './AudioReview';
import Transcription from './Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

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

// review notes page
const Collaboration = props => {
  console.log(props);
  const classes = useStyles();
  //If there are no pins, the current index should be -1
  const [curPinIndex, setCurPinIndex] = useState(() => {
    if (props.pins.length > 0) {
      return 0;
    } else {
      return -1;
    }
  });
  const [prevPinIndex, setPrevPinIndex] = useState(0);

  console.log('CURRENT PIN INDEX: ', curPinIndex);

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={2} className={classes.grid}>
          <AudioReview
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            setPrevPinIndex={setPrevPinIndex}
            audio={props.mediaUrl}
            audioLen={props.mediaDuration}
            pins={props.pins}
            user={props.user}
            recordOnlyMode={props.recordOnlyMode}
          />
          <Transcription reviewSessionID={props.reviewSessionID} username={props.username} />
          {props.recordOnlyMode !== true && (
            <DissResponse
              curPinIndex={curPinIndex}
              setCurPinIndex={setCurPinIndex}
              prevPinIndex={prevPinIndex}
              setPrevPinIndex={setPrevPinIndex}
              reviewSessionID={props.reviewSessionID}
              username={props.username}
              user={props.user}
              pins={props.pins}
              reviewUrl={props.reviewUrl}
            />
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Collaboration;
