import React, {useState} from 'react';
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
  const [playTimeArr, setPlayTimeArr] = useState([10, 20, 30]);

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={2}>
          <AudioReview 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
            playTimeArr = {playTimeArr}
            setPlayTimeArr = {setPlayTimeArr}
          />
          <Transcription />
          <Notetaking 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
            playTimeArr = {playTimeArr}
            setPlayTimeArr = {setPlayTimeArr}/>
        </Grid>
      </Container>
    </div>
  );
};

export default DisscussionPrep;