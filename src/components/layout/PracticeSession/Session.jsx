import React, {useState, useEffect} from 'react';
import VideoChatComponent from "../../VideoChatComponent.js";
import SinglePlayerVideoChat from "../SinglePlayerComponents/SinglePlayerVideoTemp";
import { useReactMediaRecorder } from "react-media-recorder";

//context
import { useSessionValue, useUserModeValue, usePlayerModeValue} from "../../../context";

const Session = () => {
    const [room, setRoom] = useState("hellooo");
    const [baseURL, setBaseURL] = useState("https://pin-mi-node-server.herokuapp.com/" + room);
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

    const { userMode } = useUserModeValue();
    const { playerMode } = usePlayerModeValue();
    console.log(playerMode);

    //hostName is a string that is the clients usermode that should host the archive. 
    const checkIsArchiveHost = (hostName) => {
        console.log("check is recording ran");
        if (userMode == hostName){
            console.log("isArchiveHost from check is rec");
            return true;
        }
        else{
            console.log("not Archive Host from check is rec");
            return false;
        }
    }

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
            <VideoChatComponent isArchiveHost={checkIsArchiveHost("callee")} />
            {/* {playerMode == "multiplayer" ? (
                <VideoChatComponent isArchiveHost={checkIsArchiveHost("callee")} />
            ) : (
                <SinglePlayerVideoChat isArchiveHost={checkIsArchiveHost("callee")} />
            )} */}
        </div>
    );
}


export default Session;