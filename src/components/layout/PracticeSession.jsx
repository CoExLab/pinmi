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
    const {status, startRecording, stopRecording, mediaBlobUrl} 
    =useReactMediaRecorder({ video: false, audio: true });

    //setting the global mediaUrl context to mediaBlobUrl to be played in AudioReview
    const {setMediaUrl} = useSessionValue();
    useEffect(() => {
        setMediaUrl(mediaBlobUrl);
        window.scrollTo(0,0);
    }, [mediaBlobUrl]);

    // const fetchServerRes = (setApiKey, setSessionId, setToken, baseURL) => {
    //     setReadyMessage("preparing video call for you now...");
    //     fetch(baseURL).then(function(res) {
    //         return res.json()
    //       }).then(function(res) {
    //         console.log("got server info");
    //         setApiKey(res.apiKey);
    //         setSessionId(res.sessionId);
    //         setToken(res.token);
    //         setReadyMessage("video call is ready now");
    //       }).catch((error) => {console.log(error)});
    // }

    return (  
        <div>
            <h1> What is pinning for? </h1>
            <p>Click on the pin to create time marks of</p>
            <ul>
                <li>situations where you struggled to use MI</li>
                <li>instances of effective MI use</li>
            </ul>
            <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
            {/* <button onClick = 
            {() => {fetchServerRes(setApiKey, setSessionId, setToken, baseURL)}}
            >Click me for getting video call ready
            </button> */}
            {/* <h1>apiKeys: {apiKey}</h1>
            <h1>sessionId: {sessionId}</h1>
            <h1>token: {token}</h1> */}
            {/* <h3>{readyMessage} </h3>
            <h3>Recording status: {status}</h3> */}
            {/* Passing in start and stop recording functions that are handled by buttons inside of this component */}
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} startRec = {startRecording} stopRec = {stopRecording}/>
        </div>
    );
}


export default PracticeSession;