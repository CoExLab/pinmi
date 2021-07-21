import React, {useState, useEffect} from 'react';
// Components
import Notetaking from '../Notetaking';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

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
  }
}));

const DisscussionPrep = () => {
  const classes = useStyles();
  const [curPinIndex, setCurPinIndex] = useState(-1);
  useEffect(() => {
    window.scrollTo(0,0);
  }, [])


  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={2}>
          <AudioReview 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
          />
          <Transcription />
          <Notetaking 
            curPinIndex = {curPinIndex}/>
        </Grid>
      </Container>
    </div>
  );
};

export default DisscussionPrep;