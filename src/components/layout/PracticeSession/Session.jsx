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
    const { vonageSessionID, setMediaDuration, setMediaUrl } = useSessionValue();
    

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
        //empty the pins array
        pins.splice(0, pins.length);
        console.log(pins);
        await firebase.firestore().collection("sessions").doc(session.sessionID).collection("pins").get()
        .then((snapshot) => {
            snapshot.docs.map(doc => {
            pins.push(doc.data());
            })
            pins.sort((a, b) => a.pinTime - b.pinTime);
        })
        .then(() => {
            setCurActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
        .catch((err) => console.error("Error in loadPins functions: ", err));
    }

        
    //archiveID redux variable
    const archiveID = useSelector(
        (state) => state.archive.archiveID
    );
    var timeout1 = 10; //1/100 second 
    var timeout2 = 10;
    var isRoomEmptyURL = baseURL + 'isRoomEmpty/' + vonageSessionID;
    var isArchiveReadyURL = baseURL + 's3/' + archiveID;
    

    //first pass in the url for the isRoomEmpty server request. 
    //Once isRoomEmpty returns true, 
    // const pingServerx = async (url) => {
    //     console.log("pinging server with " + url);
    //     let result = await fetch(url)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((data) => {
    //         //if the room has been exited this should return true
    //         if (url == isRoomEmptyURL){
    //             if(data.roomExited) {
    //                 console.log("Room has been exited by all participants. ")
    //                 timeout = 1;
    //                 return new Promise((resolve, reject) => {
    //                     setTimeout(() => resolve(pingServer(isArchiveReadyURL)), timeout)
    //                   });
    //             }
    //             else {
    //                 timeout = timeout * 2;
    //                 console.log("pinging server for isRoomEmpty with timeout: " + timeout);
    //                 return new Promise((resolve, reject) => {
    //                     setTimeout(() => resolve(pingServer(isRoomEmptyURL)), timeout)
    //                   });
    //             }
    //         }//get archive ID! This is a thing that maybe needs to be global. 
    //         else if (url == isArchiveReadyURL){
    //             //base case
    //             if(data.arcStatus == "uploaded") {
    //                 console.log("archive is Ready in s3");
    //                 setMediaUrl(data.url);
    //                 setMediaDuration(data.duration); 
    //                 return true;
    //             }
    //             else {
    //                 timeout = timeout * 2;
    //                 return new Promise((resolve, reject) => {
    //                     setTimeout(() => resolve(pingServer(isArchiveReadyURL)), timeout)
    //                   });
    //             }
    //         }
    //         else{
    //             console.log("pingServer was called with a route that doesn't exist");
    //             console.log(data);
    //             return false;
    //         }
    //     })
    //     .catch((e) => { 
    //         console.log(e)
    //         return false;
    //     });
    //     console.log("pingServer result: ", result);
    //     return result;
    // }

    const pingServer1 = async () => {
        console.log("pinging server with isRoomEmpty");
        let result = await fetch(baseURL + 'isRoomEmpty/' + vonageSessionID)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.roomExited) {
                return true;
            } else {
                timeout1 = timeout1 * 2;
                return new Promise((resolve, reject) => {
                    setTimeout(() => resolve(pingServer1()), timeout1)
                  });
            }
        })
        console.log("pingServer result: ", result);
        return result;
    }
    const pingServer2 = async () => {
        console.log("pinging server with isArchiveReady");
        let result = await fetch(baseURL + 's3/' + archiveID)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.arcStatus == "uploaded") {
                setMediaUrl(data.url);
                setMediaDuration(data.duration); 
                return true;
            } else {
                timeout2 = timeout2 * 2;
                return new Promise((resolve, reject) => {
                    setTimeout(() => resolve(pingServer2()), timeout2)
                  });
            }
        })
        console.log("pingServer result: ", result);
        return result;
    }

    var pingArray = [pingServer1,pingServer2]


    //When we pass callee into is archive host, 
  return (  
        <div>
            {!nextPage ? <VideoChatComponent setNextPage={setNextPage} isArchiveHost={checkIsArchiveHost("callee")} />
            : <Loading isRoomEmpty={pingServer1} isArchiveReady = {pingServer2} finishLoading={loadPins}/>}
        </div>
    );
}


export default Session;