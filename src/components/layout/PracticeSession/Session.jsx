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

    // const addMediaUrlDB = async (mediaUrl) => {
    //     await firebase.firestore().collection("URL").doc("media").set({
    //       URL: mediaUrl
    //   })
    //   .then(() => {
    //       console.log("Document successfully written!");
    //   })
    //   .catch((error) => {
    //       console.error("Error writing document: ", error);
    //   });
    //   }

    useEffect(() => {
        // if (userMode == "callee"){
        //     setMediaUrl(mediaBlobUrl);
        //     //addMediaUrlDB(mediaBlobUrl)
        // }
        // else {

        // }
        setMediaUrl(mediaBlobUrl);
        console.log("mediablobURL: ", mediaBlobUrl);
        window.scrollTo(0,0);
    }, [mediaBlobUrl]);

    return (  
        <div>
            
            <VideoChatComponent apiKey = {apiKey} sessionId = {sessionId} token = {token} isRecording = {isRecording} startRec = {startRecording} stopRec = {stopRecording}/>
        </div>
    );
}


export default Session;