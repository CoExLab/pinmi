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
            <h1> What is pinning for? </h1>
            <p>Click on the pin to create time marks of</p>
            <ul>
                <li>situations where you struggled to use MI</li>
                <li>instances of effective MI use</li>
            </ul>
            <p>Your peer will also be pinning, and you will review and discuss all pins after the client session.</p>
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
        </div>
    );
}

//NOT FUNCTIONAL YET. DO NOT USE
function startArchive(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var sessionId = {"sessionId" : "2_MX40NzI1ODU3NH5-MTYyNjE5NjI3OTgwOH5ieXZaRktvWm9ITE9pYlArYThxdk9PazF-fg"}
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("I posted :)");
        }
    }
    xhr.send(sessionId);
    // $.post("https://pinmi-test.herokuapp.com/" + '/archive/start', {'sessionId': sessionId}, null, 'json');
    // $('#start').hide();
    // $('#stop').show();
  }


export default PracticeSession;