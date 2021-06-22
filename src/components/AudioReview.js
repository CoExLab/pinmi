import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Icon, Fab, CircularProgress } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ReactPlayer from 'react-player';
import audio from '../other/audio.mp3';
import pin from '../other/pin.svg';
import {formatTime, generatePushId} from '../helper/index';

// context
import { useActiveStepValue } from "../context";

// firebase hook
import { usePins } from '../hooks/index';
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
}));

const AudioReview = ({curPinIndex, setCurPinIndex}) => {
    // const {pinBtnActive, setPinBtnActive} = useState(true)

    const classes = useStyles();
    const player = useRef(null);
    const {curActiveStep} = useActiveStepValue();
    // fetch raw pin data here
    const { pins, setPins } = usePins();
    // get document ID
    const pinID = generatePushId();

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false);
    // const test = true;
    
    let playTimeArr = pins.map(pin => pin.pinTime);

    const handleLastPin = (index) => {   
        if(curPinIndex > 0){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
        }
    };

    const handleNextPin = (index) => {
        if(curPinIndex < pins.map(pin => pin.pinTime).length - 1){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
        }
    };

    const addPin = (curTime) => {
        firebase.firestore().collection("Pins").doc(formatTime(curTime)).set({
            pinID,
            pinTime: curTime,
            pinInfos: {"pinNote": "", "pinPerspective": "", "pinCategory": "", "pinSkill": ""}
        })        
        .then( () => {
            setPins([...pins]);
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    const deletePin = (docId) => {
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
        // ui off
        setTimeout(() => {
            setPinBtnDisabled(false);
        }, 1000);
    };

    const handlePin = () => {
        const curTime = Math.round(player.current.getCurrentTime());
        let index = playTimeArr.indexOf(curTime);
        if (pins.map(pin => pin.pinTime).indexOf(curTime) !== -1) {
            // remove current pin
            deletePin(pins.map(pin => pin.docId)[index]);
            // auto jump to next available pin point
            if(pins.map(pin => pin.pinTime).length === 0) {
                player.current.seekTo(parseFloat(0));
                console.log("1");
            }
            else if(pins.map(pin => pin.pinTime).length === 2){
                curPinIndex === 0 ? 
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[1])) : 
                handleLastPin(curPinIndex - 1)
                console.log("2");
            }
            else{
                curPinIndex === pins.map(pin => pin.pinTime).length - 2 || curPinIndex === pins.map(pin => pin.pinTime).length - 1 ? 
                handleLastPin(curPinIndex - 1) : 
                handleNextPin(curPinIndex + 1);
                console.log("3");
            }
        } else {
            // add current playtime as a new pin
            addPin(curTime);
        }
    };

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
                <ReactPlayer
                    ref={player}
                    url={audio}
                    controls = {true}
                    width="100%"
                    height="55px"
                    style={{ marginBottom: 8 }}
                />
                <div className={classes.root} >
                    <Fab color="default" aria-label="last" className={classes.fab} 
                         onClick={() => handleLastPin(curPinIndex - 1)} >
                        <NavigateBeforeIcon />
                    </Fab>
                    <Fab color="default" aria-label="addPin"
                          onClick={() => handlePin()} disabled = {pinBtnDisabled}>
                        <Icon classes={{ root: classes.iconRoot }}>
                            <img className={classes.imageIcon} src={pin} alt="" />
                        </Icon>          
                    </Fab>
                    <Fab color="default" aria-label="next" 
                          onClick={() => handleNextPin(curPinIndex + 1)} >
                        <NavigateNextIcon />      
                    </Fab>

                    {pinBtnDisabled ? <CircularProgress /> : null}
                    <Typography>{"Current Pin Time is: " + formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}</Typography>
                    <Typography>{"New Pins from database: " + pins.map(pin => pin.pinTime)}</Typography>
                    <Typography>{"Current pin index: " + curPinIndex}</Typography>
                </div>
            </Paper>
        </Grid>
    );
};

export default AudioReview;