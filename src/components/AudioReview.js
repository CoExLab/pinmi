import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
//import audio from '../other/audio.mp3';
import ColorLibAudioPlayer from './layout/ColorLibComponents/ColorLibAudioPlayer';
import {formatTime, generatePushId} from '../helper/index';

// context
import { useActiveStepValue } from "../context";
import { useSessionValue } from "../context";
import { useEffect } from "react";

// firebase hook
import { usePins, useMediaURL } from '../hooks/index';
import { firebase } from "../hooks/firebase";

const AudioReview = ({curPinIndex, setCurPinIndex}) => {
    const player = useRef(null);
    const {curActiveStep} = useActiveStepValue();
    // fetch raw pin data here
    const { pins, setPins } = usePins();
    // get document ID
    const pinID = generatePushId();
    // hard-coded sessionID here
    const MiTrainingSessionID = "123";

    // const { mediaURL: audio, setMediaURL } = useMediaURL();

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(0);
    const {mediaUrl: audio, setMediaUrl, setMediaDuration,mediaDuration: audioLen} = useSessionValue();
    const [audioPlaying, setAudioPlaying] = useState(false);
    console.log(audio, audioLen);
    const [loadURL, setLoadURL] = useState(false)

    let playTimeArr = pins.map(pin => pin.pinTime);

    useEffect(() =>{
        //callback function when useEffect is called
        let ref = firebase
        .firestore()
        .collection("MediaURLs")
        .doc("test");

        var unsubscribe = ref.onSnapshot((doc) => {
            let recentURL = doc.data();
            console.log(recentURL.URL);
            setMediaUrl(recentURL.URL);
            setMediaDuration(recentURL.Duration);

        })
        return () => {
            unsubscribe()
        };
    },[loadURL]);


    // back to last pin
    const handleLastPin = (index) => {   
        console.log(audio);
        console.log(audioLen);
        console.log(audioProgress);
        if(curPinIndex > 0){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
        }
    };

    // go to next pin
    const handleNextPin = (index, remove = false) => {
        if(curPinIndex < pins.map(pin => pin.pinTime).length - 1){
            if(!remove){
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                setCurPinIndex(index);
            } else{                
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                setCurPinIndex(index - 1);
            }
        }
    };

    const addPin = async (curTime) => {
        // ui on
        setPinBtnDisabled(true);
        setPinBtnColor("primary");
        // ui off
        setTimeout(() => {
            setPinBtnDisabled(false);
        }, 800);

        await firebase.firestore().collection("Pins").doc(formatTime(curTime)).set({
            pinID,
            pinTime: curTime,
            // pinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
            sessionID: MiTrainingSessionID,
            callerPinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
            calleePinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""},
        })        
        .then( () => {
            setPins([...pins, ]);
        })
        .then(() => {
            console.log("Document successfully written!");    
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });  
        console.log("finished writing")      
        console.log(curTime); 
        //seek to
        let dummyPlayTimeArr = [...pins, {
            pinID,
            pinTime: curTime,
            pinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""}
        }].sort((a, b) => a.pinTime - b.pinTime);

        setCurPinIndex(dummyPlayTimeArr.map(pin => pin.pinTime).indexOf(curTime));   
    }

    const deletePin = async (docId) => {
        firebase
          .firestore()
          .collection("Pins")
          .doc(docId)
          .delete()
          .then(() => {
            setPins([...pins]);
        })
        .then(() => {
            console.log("Document successfully deleted!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        // ui on
        setPinBtnDisabled(true);
        setPinBtnColor("secondary");
        // ui off
        setTimeout(() => {
            setPinBtnDisabled(false);
        }, 800);
    };

    const handlePin = () => {
        const curTime = Math.round(player.current.getCurrentTime());
        let index = playTimeArr.indexOf(curTime);
        if (pins.map(pin => pin.pinTime).indexOf(curTime) !== -1) {
            // remove current pin
            deletePin(pins.map(pin => pin.docId)[index]);
            // auto jump to next available pin point
            console.log(pins.length);
            if(pins.map(pin => pin.pinTime).length === 0) {
                player.current.seekTo(parseFloat(0));
            }
            else if(pins.map(pin => pin.pinTime).length === 2){
                curPinIndex === 0 ? 
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[1])) : 
                handleLastPin(curPinIndex - 1)
            }
            else{
                curPinIndex === pins.map(pin => pin.pinTime).length - 1 || 
                curPinIndex === pins.map(pin => pin.pinTime).length ? 
                handleLastPin(curPinIndex - 1) : 
                handleNextPin(curPinIndex + 1, true);
            }
        } else {
            // add current playtime as a new pin and seek to it
            addPin(curTime);
        }
    };

    const handleProgress = state => {
        setAudioProgress(Math.round(state.playedSeconds)); 
    }

    const handleAudioProgress = (currentTime) => {
        setAudioProgress(currentTime);
        if (player.current != null) {
            player.current.seekTo(currentTime);
        }
    }

    return (
        <Grid item xs={12}>
            { curActiveStep === 2 ? 
            (
                <Typography variant='h6'>Listen back to the session, add pins, and take notes to discuss with your peer. 
                </Typography> 
            ) 
            : 
            (
                <Typography variant='h6'>Review all pins with your peer, User Name...
                </Typography> 
            ) 
            }
            <ColorLibAudioPlayer
                playerStatus = {audioPlaying}
                setPlayerStatus = {setAudioPlaying}
                currentTime = {
                    audioProgress
                }
                setCurrentTime = {handleAudioProgress}
                duration = {audioLen}
                marks = {pins.map(pin => pin.pinTime)}
                addPin = {addPin}
            />
            <ReactPlayer
                hidden
                playing = {audioPlaying}
                ref={player}
                url={audio}
                controls = {true}
                width="100%"
                height="55px"
                style={{ marginBottom: 8 }}
                onProgress = {handleProgress}
            />
        </Grid>
    );
};

export default AudioReview;