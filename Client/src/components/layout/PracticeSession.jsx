import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../VideoChatComponent.js";
import { useReactMediaRecorder } from "react-media-recorder";

//context
import { useSessionValue } from "../../context";

const PracticeSession = () => {
    const [room, setRoom] = useState("hellooo");
    const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
    const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    const [token, setToken] = useState("YOUR_TOKEN");
    const [readyMessage, setReadyMessage] = useState("video is not ready");
    const [isRecording , setIsRecording] = useState(true);
    const {status, startRecording, stopRecording, mediaBlobUrl} 
    =useReactMediaRecorder({ video: false, audio: true });

    //setting the global mediaUrl context to mediaBlobUrl to be played in AudioReview
    useEffect(() => {
        window.scrollTo(0,0);
    });

    return (  
        <div>
            <h1> What is pinning for? </h1>
            <p>Click on the pin to create time marks of</p>
            <ul>
                <li>situations where you struggled to use MI</li>
                <li>instances of effective MI use</li>
            </ul>
            <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
            <VideoChatComponent isRecording = {isRecording} />
        </div>
    );
}


export default PracticeSession;