import React, { useRef, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
//import audio from '../other/audio.mp3';
import ColorLibAudioPlayer from './layout/ColorLibComponents/ColorLibAudioPlayer';
import {formatTime, generatePushId} from '../helper/index';

// context
import { useActiveStepValue, useSessionValue, usePinsValue, useUserModeValue } from "../context";

// firebase hook
import { usePins, useMediaURL } from '../hooks/index';
import { firebase } from "../hooks/firebase";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

const AudioReview = ({curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex}) => {
    const player = useRef(null);
    const {curActiveStep} = useActiveStepValue();
    //session data
    const {sessionID, setMediaDuration , setMediaUrl, mediaUrl: audio, mediaDuration: audioLen} = useSessionValue();
    // fetch raw pin data here
    const { pins } = usePinsValue();
    //fetch user data
    const {userID, userMode} = useUserModeValue();

    // get document ID
    const pinID = generatePushId();
    // hard-coded sessionID here
    const MiTrainingSessionID = "123";

    // const { mediaURL: audio, setMediaURL } = useMediaURL();

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(Math.max(0, pins[0].pinTime - 10));
    useState(0);
    const [audioPlaying, setAudioPlaying] = useState(false);
    
    const [loadURL, setLoadURL] = useState(false)
    useEffect(() => {
        const time = pins[curPinIndex].pinTime;
        setAudioProgress(Math.max(0, time - 10));

        console.log("Audio from AudioReview useEffect" + audio)
    }, [curPinIndex]);
    

    let playTimeArr = pins.map(pin => pin.pinTime);

    const getDBMediaURL = async () => {
        const docRef = await firebase.firestore().collection("sessions").doc(sessionID)
        docRef.get().then((doc) => {
          if (doc.exists) {
              if (doc.data().media_url != "default"){
                console.log("caller db mediaURL getter:"+ doc.data().media_url)
                setMediaDuration(doc.data().duration);
                setMediaUrl(doc.data().media_url);
                return(doc.data().media_url);
              }
              else{
                //MAYBE DO SOMETHING HERE TO INDICATE THAT URL IS NOT LOADED YET
                console.log("URL is not set yet")
                return("default")
              }
            } 
          else{
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        });
      }

    // back to last pin
    const handleLastPin = (index) => {   
        console.log(audio);
        console.log(audioLen);
        console.log(audioProgress);
        if(curPinIndex > 0){
            setCurPinIndex(index - 1);
            player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index - 1]));
        }
    };

    // go to next pin
    const handleNextPin = (index, remove = false) => {
        console.log("interesting: " + curPinIndex + " length: " + pins.length);
        if(curPinIndex < pins.length - 1){
            console.log("Index: " + index);
            if(!remove){
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                setCurPinIndex(index);
            } else{                
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index ]));
                setCurPinIndex(index);
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

        //create a newPin object to house pin details
        const newPin = {
            pinID: '',
            creatorID: userID,
            creatorMode: userMode,
            pinTime: curTime, 
            callerPinNote: '',
            callerPinPerspective: '',
            callerPinCategory: '',
            callerPinSkill: '',
            calleePinNote: '',
            calleePinPerspective: '',
            calleePinCategory: '',
            calleePinSkill: '',
            pinGoal: '',
            pinStrength: '',
            pinOpportunity: '',
        }; 

        //now correctly add the pin into the array to maintain sortedness
        pins.splice(curPinIndex + 1, 0, newPin);

        //update the current pin index so it points to the newly created pin
        setPrevPinIndex(curPinIndex);
        setCurPinIndex(curPinIndex + 1);
    }

    const deletePin = async (index) => {

        pins.splice(index, 1);
        console.log("Document successfully deleted!");
        
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
        addPin(curTime);
        // if (pins.map(pin => pin.pinTime).indexOf(curTime) !== -1) {
        //     // remove current pin
        //     deletePin(index);
        //     // auto jump to next available pin point
        //     console.log(pins.length);
        //     if(pins.map(pin => pin.pinTime).length === 0) {
        //         player.current.seekTo(parseFloat(0));
        //     }
        //     else if(pins.map(pin => pin.pinTime).length === 2){
        //         curPinIndex === 0 ? 
        //         player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[1])) : 
        //         handleLastPin(curPinIndex - 1)
        //     }
        //     else{
        //         curPinIndex === pins.map(pin => pin.pinTime).length - 1 || 
        //         curPinIndex === pins.map(pin => pin.pinTime).length ? 
        //         handleLastPin(curPinIndex - 1) : 
        //         handleNextPin(curPinIndex + 1, true);
        //     }
        // } else {
        //     // add current playtime as a new pin and seek to it
        //     addPin(curTime);
        // }
    };

    const handleProgress = state => {
        setAudioProgress(Math.round(state.playedSeconds)); 
    }

    const handleAudioProgress = (currentTime) => {
        setAudioProgress(currentTime);
        console.log("Current Time in AR: " + currentTime);
        if (player.current != null) {
            player.current.seekTo(currentTime);
        }
        //if the audio progress hits the next pin, update the current pin index
        const newIndex = pins.findIndex((elem) => elem.pinTime > currentTime);
        console.log("New Index: " + newIndex);
        if(newIndex == -1) {
            setPrevPinIndex(curPinIndex);
            setCurPinIndex(pins.length - 1);
        } else if (newIndex == 0) {
            setPrevPinIndex(curPinIndex);
            setCurPinIndex(0);
        } else {
            setPrevPinIndex(curPinIndex);
            setCurPinIndex(newIndex - 1);
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
                <Typography variant='h6'>Review all pins with your peer
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