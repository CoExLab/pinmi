import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../../VideoChatComponent.js";
import { useReactMediaRecorder } from "react-media-recorder";

//context
import { useSessionValue } from "../../../context";

const Session = () => {
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
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
        </div>
    );
}


export default Session;
