import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import VideoChatComponent from "../../VideoChatComponent.js";
import Loading from "./Loading";
import { baseURL, usingS3 } from '../../constants';
import { firebase } from '../../../hooks/firebase';

//context
import { useSessionValue, usePinsValue, useActiveStepValue } from "../../../context";

const Session = () => {
    const [nextPage, setNextPage] = useState(false);
    const { pins } = usePinsValue();
    const session = useSelector(state => state.session);
    const {setCurActiveStep} = useActiveStepValue();

    // const [baseURL, setBaseURL] = useState("https://pin-mi-node-server.herokuapp.com/" + room);
    // const [apiKey, setApiKey] = useState("YOUR_API_KEY");
    // const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
    // const [token, setToken] = useState("YOUR_TOKEN");
    // const [readyMessage, setReadyMessage] = useState("video is not ready");
    // const isRecording = true;
    // const {status, startRecording, stopRecording, mediaBlobUrl} 
    // =useReactMediaRecorder({ video: false, audio: true });


    //setting the global mediaUrl context to mediaBlobUrl to be played in AudioReview
    const { setMediaUrl, vonageSessionID } = useSessionValue();

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

    //hostName is a string that is the clients usermode that should host the archive. 
    const checkIsArchiveHost = (hostName) => {
        console.log("check is recording ran");
        if (user.userMode == hostName) {
            console.log("isArchiveHost from check is rec");
            return true;
        }
        else {
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

    //loadPins is a function that grabs all pins in the db and saves them locally
    const loadPins = async () => {
        pins.splice(0, pins.length);
        const snapshot = await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").get();
        snapshot.docs.map(doc => {
          pins.push(doc.data());
        })
        setCurActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    var timeout = 1;
    
    const pingServer = async () => {
        console.log("pinging server with isRoomEmpty");
        await fetch(baseURL + 'isRoomEmpty/' + vonageSessionID)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(JSON.parse(data).roomExited) {
                return true;
            } else {
                timeout = timeout * 2;
                return setTimeout(pingServer, timeout);
            }
        })
    }
    //When we pass callee into is archive host, 
  return (  
        <div>
            {!nextPage ? <VideoChatComponent setNextPage={setNextPage} isArchiveHost={checkIsArchiveHost("callee")} />
            : <Loading isReady={pingServer} finishLoading={loadPins}/>}
        </div>
    );
}


export default Session;