import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Icon, Fab, CircularProgress } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ReactPlayer from 'react-player';
//import audio from '../other/audio.mp3';
import pin from '../other/pin.svg';
import {formatTime, generatePushId} from '../helper/index';

import SliderBar from './SliderBar';

// context
import { useActiveStepValue, useSessionValue, usePinsValue } from "../context";
import { useEffect } from "react";

// firebase hook
import { usePins, useMediaURL } from '../hooks/index';
import { firebase } from "../hooks/firebase";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
          margin: theme.spacing(1),
        },
    },
    imageIcon: {
        height: '100%'
    },
    iconRoot: {
        textAlign: 'center'
    },
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(5),
    },
}));

const AudioReview = ({curPinIndex, setCurPinIndex}) => {
    const classes = useStyles();
    const player = useRef(null);
    const {curActiveStep} = useActiveStepValue();
    //session data
    const {sessionID, mediaUrl: audio, setMediaUrl, setMediaDuration,mediaDuration: audioLen} = useSessionValue();
    // fetch raw pin data here
    const { pins } = usePinsValue();
    // get document ID
    const pinID = generatePushId();
    // hard-coded sessionID here
    const MiTrainingSessionID = "123";

    //const { mediaURL: audio, setMediaURL } = useMediaURL();

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(0);
    const [loadURL, setLoadURL] = useState(false)
    

    let playTimeArr = pins.map(pin => pin.pinTime);

    // useEffect(() =>{
    //     //callback function when useEffect is called
    //     let ref = firebase
    //     .firestore()
    //     .collection("MediaURLs")
    //     .doc("test");

    //     var unsubscribe = ref.onSnapshot((doc) => {
    //         let recentURL = doc.data();
    //         console.log(recentURL.URL);
    //         setMediaUrl(recentURL.URL);
    //         setMediaDuration(recentURL.Duration);

    //     })
    //     return () => {
    //         unsubscribe()
    //     };
    // },[loadURL]);


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

        pins.push({pinID: '', pinTime: curTime, pinInfos: {pinNote: "", pinPerspective: "", pinCategory: "", pinSkill: ""}});
        
        //seek to
        let dummyPlayTimeArr = [...pins, {
            pinID,
            pinTime: curTime,
            pinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""}
        }].sort((a, b) => a.pinTime - b.pinTime);

        setCurPinIndex(dummyPlayTimeArr.map(pin => pin.pinTime).indexOf(curTime));   
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
            <Paper variant='outlined' style={{ padding: 10, marginTop: 10 }}>         
                <SliderBar 
                    maxValue = {audioLen} 
                    curValue = {audioProgress} 
                    pinMarks = {pins.map(pin => pin.pinTime)}
                    canClick = {pinBtnDisabled}
                />
                <ReactPlayer
                    ref={player}
                    url={audio}
                    controls = {true}
                    width="100%"
                    height="55px"
                    style={{ marginBottom: 8 }}
                    // onDuration={(duration) => setAudioLen (duration)}
                    onProgress = {handleProgress}
                    // onSeek={(e) => {
                    //     setAudioProgress(e); 
                    //     // const curTime = Math.round(player.current.getCurrentTime());
                    //     // let index = playTimeArr.indexOf(curTime);
                    //     // if(index !== -1){
                    //     //     setCurPinIndex(index);
                    //     //     player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                    //     // }
                    // }}
                />
                <div className={classes.root} >
                    <Fab 
                        color="default" 
                        aria-label="last" 
                        onClick={() => handleLastPin(curPinIndex - 1)} 
                    >
                        <NavigateBeforeIcon />
                    </Fab>
                    <Fab color="default" aria-label="addPin"
                          onClick={() => handlePin()} disabled = {pinBtnDisabled}>
                        {pinBtnDisabled 
                        ? 
                        <CircularProgress color={pinBtnColor} /> 
                        :                         
                        <Icon classes={{ root: classes.iconRoot }}>
                            <img className={classes.imageIcon} src={pin} alt="" />
                        </Icon>   
                        }
                    </Fab>
                    <Fab color="default" aria-label="next" 
                          onClick={() => handleNextPin(curPinIndex + 1)} >
                        <NavigateNextIcon />    
                    </Fab>
                    {/* below are something thing only for debugging */}
                    {/* <Typography>{"Current Pin Time is: " + formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}</Typography>
                    <Typography>{"New Pins from database: " + pins.map(pin => formatTime(pin.pinTime))}</Typography>
                    <Typography>{"Current pin index: " + curPinIndex}</Typography> */}
                </div>
            </Paper>
        </Grid>
    );
};

export default AudioReview;