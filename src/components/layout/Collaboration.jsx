import React, {useState, useEffect} from 'react';
// Components
import DissResponse from '../DissResponse';
import AudioReview from '../AudioReview';
import Transcription from '../Transcription';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import VideoChatComponent from '../VideoChatComponent';
import {apiKey, sessionId, token} from '../constants';
import { useSessionValue } from "../../context";

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

const Collaboration = () => {
  const classes = useStyles();
  const [curPinIndex, setCurPinIndex] = useState(-1);

  const [room, setRoom] = useState("hello");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");
    const isRecording = false;

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={2}>
          <AudioReview 
            curPinIndex = {curPinIndex} 
            setCurPinIndex = {setCurPinIndex}
          />
          <Transcription />
          <DissResponse 
            curPinIndex = {curPinIndex}/>
        </Grid>
      </Container>
    </div>
  );
};

export default Collaboration;
