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
import { useActiveStepValue } from "../context";
import { useSessionValue } from "../context";
import { useEffect } from "react";

// firebase hook
import { usePins, useMediaURL } from '../hooks/index';
import { firebase } from "../hooks/firebase";

const useStyles = makeStyles((theme) => ({
    root: {
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
    fab: {
        marginLeft: 500,
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
    const {mediaUrl: audio, setMediaUrl, mediaDuration: audioLen, setMediaDuration: setAudioLen, sessionID} = useSessionValue();
    // fetch raw pin data here
    const { pins, setPins } = usePins(sessionID);
    // get document ID
    const pinID = generatePushId();
    // hard-coded sessionID here
    const MiTrainingSessionID = "123";

    //const { mediaURL: audio, setMediaURL } = useMediaURL();

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false); 
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(0);
    const [loadURL, setLoadURL] = useState(false)
    // const [audioLen, setAudioLen] = useState(0);

    let playTimeArr = pins.map(pin => pin.timestamp);

    // useEffect(() =>{
    //     //callback function when useEffect is called
    //     console.log("sessionID: " + sessionID);
    //     (async () => await firebase
    //     .firestore()
    //     .collection("sessions").doc(sessionID).update({
    //         media_url: audio
    //     })) ();
    // },[loadURL]);


    // back to last pin
    const handleLastPin = (index) => {   
        console.log(pins[index]);
        if(curPinIndex > 0){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(pins.map(pin => pin.timestamp)[index]));
        }
    };

    // go to next pin
    const handleNextPin = (index, remove = false) => {
        if(curPinIndex < pins.map(pin => pin.timestamp).length - 1){
            if(!remove){
                player.current.seekTo(parseFloat(pins.map(pin => pin.timestamp)[index]));
                setCurPinIndex(index);
            } else{                
                player.current.seekTo(parseFloat(pins.map(pin => pin.timestamp)[index]));
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

        await firebase.firestore().collection("sessions").doc(sessionID).collection("pins").add({
            user_id: '',
            timestamp: formatTime(curTime),
            notes: '',
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
            timestamp: curTime,
            user_id: '',
            notes: ''
        }].sort((a, b) => a.pinTime - b.pinTime);

        setCurPinIndex(dummyPlayTimeArr.map(pin => pin.timestamp).indexOf(curTime));   
    }

    const deletePin = async (docId) => {
        firebase
          .firestore()
          .collection('sessions')
          .doc(sessionID)
          .collection("pins")
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
        if (pins.map(pin => pin.timestamp).indexOf(curTime) !== -1) {
            // remove current pin
            deletePin(pins.map(pin => pin.id)[index]);
            // auto jump to next available pin point
            console.log(pins.length);
            if(pins.map(pin => pin.timestamp).length === 0) {
                player.current.seekTo(parseFloat(0));
            }
            else if(pins.map(pin => pin.timestamp).length === 2){
                curPinIndex === 0 ? 
                player.current.seekTo(parseFloat(pins.map(pin => pin.timestamp)[1])) : 
                handleLastPin(curPinIndex - 1)
            }
            else{
                curPinIndex === pins.map(pin => pin.timestamp).length - 1 || 
                curPinIndex === pins.map(pin => pin.timestamp).length ? 
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
    
    // console.log("AudioLen: " + audioLen);
    // console.log("audio: " + audio );
    // console.log("pins: " + pins);
    return (
        <Grid item xs={12}>
            { curActiveStep === 2 ? 
            (
                <Typography variant='h6'>Listen back to your audio recording with pins and take notes to discuss with your peer. 
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
                    pinMarks = {pins.map(pin => pin.timestamp)}
                    canClick = {pinBtnDisabled}
                />
                <ReactPlayer
                    ref={player}
                    url={audio}
                    controls={true}
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
                <button onClick ={() => {setLoadURL(!loadURL)}}>Load URL</button>
                <div className={classes.root} >
                    {curPinIndex == 0 ? 
                    <Fab color="default" disabled="true" aria-label="last" className={classes.fab}>
                        <NavigateBeforeIcon />
                    </Fab>
                    : 
                    <Fab color="default" disabled="false" aria-label="last" className={classes.fab} 
                         onClick={() => handleLastPin(curPinIndex - 1)} >
                        <NavigateBeforeIcon />
                    </Fab>
                    }
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
                    {curPinIndex == pins.length 
                    ? <Fab color="default" disabled="true" aria-label="next"> </Fab>
                    : <Fab color="default" aria-label="next" 
                          onClick={() => handleNextPin(curPinIndex + 1)}>
                        <NavigateNextIcon />    
                    </Fab>
                    }
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