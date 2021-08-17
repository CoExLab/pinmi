import { Button } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Intro from "./PracticeSession/Intro.jsx"
import Narrative from "./PracticeSession/Narrative.jsx"
import Session from "./PracticeSession/Session.jsx"
import Collaboration from "./Collaboration.jsx"
import VideoChatComponent from "../VideoDiscussion.js";
import { useReactMediaRecorder } from "react-media-recorder";

//context
import { useSessionValue } from "../../context";


function getConditionalContent(page, apiKey, sessionId, token, isRecording, startRecording, stopRecording) {
    switch (page) {
      case 0:
        return <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
      case 1:
        return <Collaboration />;
      case 2:
        return <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/> ;
      default:
        return <div>Unknown</div>;
    }
}

function getConditionalButton(page) {
    switch (page) {
      case 0:
        return "Review Client Information"
      case 1:
        return "Begin Live Session";
      case 2:
        return "Begin Discussion Prep";
      default:
        return <div>Unknown</div>;
    }
}

const PracticeSession = () => {
    const [page, setPage] = useState(0);
    const handleButton = () => {
        setPage(page+1);
    }

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
            <Button onClick={() => setPage(page+1)}>{getConditionalButton(page)}</Button>
        </div>
    );
}


export default PracticeSession;