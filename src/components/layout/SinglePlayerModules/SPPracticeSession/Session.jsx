import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../../../VideoChatComponent.js";
import { useReactMediaRecorder } from "react-media-recorder";

//context
import { useSessionValue, usePlayerModeValue} from "../../../../context";
import SinglePlayerVideoChat from '../../SinglePlayerComponents/SinglePlayerVideoChat.jsx';
import { useSelector } from 'react-redux';

const Session = () => {
    // const [baseURL, setBaseURL] = useState("https://pin-mi-node-server.herokuapp.com/" + room);
    // const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    // const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    // const [token, setToken] = useState("YOUR_TOKEN");
    // const [readyMessage, setReadyMessage] = useState("video is not ready");
    // const isRecording = true;
    // const {status, startRecording, stopRecording, mediaBlobUrl} 
    // =useReactMediaRecorder({ video: false, audio: true });
    

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

    const user = useSelector(state => state.user);
    const { playerMode } = usePlayerModeValue();
    console.log(playerMode);

    //hostName is a string that is the clients usermode that should host the archive. 
    const checkIsArchiveHost = (hostName) => {
        console.log("check is recording ran");
        if (user.userMode == hostName){
            console.log("isArchiveHost from check is rec");
            return true;
        }
        else{
            console.log("not Archive Host from check is rec");
            return false;
        }
    }

    // useEffect(() => {
    //     // if (userMode == "callee"){
    //     //     setMediaUrl(mediaBlobUrl);
    //     //     //addMediaUrlDB(mediaBlobUrl)
    //     // }
    //     // else {

    //     // }
    //     setMediaUrl(mediaBlobUrl);
    //     console.log("mediablobURL: ", mediaBlobUrl);
    //     window.scrollTo(0,0);
    // }, [mediaBlobUrl]);

    //When we pass callee into is archive host, 
    return (
        <div> 
            <SinglePlayerVideoChat isArchiveHost = {checkIsArchiveHost("callee")}/>
        </div>
    );
}


export default Session;