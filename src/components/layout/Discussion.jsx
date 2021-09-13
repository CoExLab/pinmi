import { Button, Box } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Intro from "./PracticeSession/Intro.jsx"
import Narrative from "./PracticeSession/Narrative.jsx"
import Session from "./PracticeSession/Session.jsx"
import Collaboration from "./Collaboration.jsx"
import VideoChatComponent from "../VideoDiscussion.js";

import VideoChatComponentSecond from "../VideoDiscussionSecond.js";
import { useReactMediaRecorder } from "react-media-recorder";
import { ColorLibNextButton } from './ColorLibComponents/ColorLibButton';
import ColorLibButton from './ColorLibComponents/ColorLibButton';


//context
import { useSessionValue } from "../../context";


function getConditionalContent(page, apiKey, sessionId, token, isRecording, startRecording, stopRecording) {
    switch (page) {
      case 0:
        return <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
      case 1:
        return <Collaboration />;
      case 2:
        return <VideoChatComponentSecond apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/> ;
      default:
        return <div>Unknown</div>;
    }
}

function getConditionalButton(page, setPage) {
  const handleButton = () => {
    setPage(page+1);
}
    switch (page) {
      case 0:
        return (
          <div>
            <Box align='center' m = {2} mb = {20}> 
              <ColorLibNextButton variant='contained' size='medium' onClick={() => handleButton()}>
                Let's talk about our pins
              </ColorLibNextButton>
            </Box>
          </div>
        );
      case 1:
        return (
          <div>
            <Box align='center' m = {2} mb = {20}> 
              <ColorLibButton variant='contained' size='medium' onClick={() => handleButton()}>
                Finish Discussing Pins
              </ColorLibButton>
            </Box>
          </div>
        );
      case 2:
        return ;
      default:
        return <div>Unknown</div>;
    }
}

const PracticeSession = () => {
    const [page, setPage] = useState(0);

    const [room, setRoom] = useState("hellooo");
    //const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");
    const isRecording = true;
    const {status, startRecording, stopRecording, mediaBlobUrl} 
    =useReactMediaRecorder({ video: false, audio: true });
    

    //setting the global mediaUrl context to mediaBlobUrl to be played in AudioReview
    const {setMediaUrl} = useSessionValue();
    useEffect(() => {
        setMediaUrl(mediaBlobUrl);
        window.scrollTo(0,0);
    }, [mediaBlobUrl]);

    return (  
        <div>
            {getConditionalContent(page, apiKey, sessionId, token, isRecording, startRecording, stopRecording)}  
            {getConditionalButton(page, setPage)}
        </div>
    );
}


export default PracticeSession;