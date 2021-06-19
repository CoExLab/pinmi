import React, { useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Icon, Fab } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ReactPlayer from 'react-player';
import audio from '../other/audio.mp3';
import pin from '../other/pin.svg';
import {formatTime} from '../helper/index';
// context
import { useActiveStepValue } from "../context";
// firebase hook
import { usePins } from '../hooks/index';

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

const AudioReview = ({curPinIndex, setCurPinIndex, playTimeArr, setPlayTimeArr}) => {
    const classes = useStyles();
    const {curActiveStep} = useActiveStepValue();

    // fetch pin data here
    const { pins, setPins } = usePins();

    const tempPlayTimeArr = pins.map(pin => pin.PinTime);
    // setPlayTimeArr(tempPlayTimeArr);
    useEffect( () => {
        setPlayTimeArr(tempPlayTimeArr);
    },[]);

    const player = useRef(null);

    const handleLastPin = (index) => {        
        if(curPinIndex > 0){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(playTimeArr[index]));
        }
    };

    const handleNextPin = (index) => {
        if(curPinIndex < playTimeArr.length - 1){
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(playTimeArr[index]));
        }
    };

    const handlePin = () => {
        let newPlayTimeArr = [...playTimeArr];
        const curTime = Math.round(player.current.getCurrentTime());
        let index = playTimeArr.indexOf(curTime);
        if (playTimeArr.indexOf(Math.round(player.current.getCurrentTime())) !== -1) {
            // remove current pin
            newPlayTimeArr.splice(index, 1);
            newPlayTimeArr.sort((a,b) => a - b);
            // auto jump to next available pin point
            if(playTimeArr.length === 0) {
                player.current.seekTo(parseFloat(0));
            }
            else if(playTimeArr.length === 2){
                curPinIndex === 0 ? 
                player.current.seekTo(parseFloat(playTimeArr[1])) : 
                handleLastPin(curPinIndex - 1)
            }
            else{
                curPinIndex === playTimeArr.length - 2 || curPinIndex === playTimeArr.length - 1 ? 
                handleLastPin(curPinIndex - 1) : 
                handleNextPin(curPinIndex + 1);
            }
        } else {
            // add current playtime as a new pin
            newPlayTimeArr.push(curTime);
            newPlayTimeArr.sort((a,b) => a - b);
        }
        setPlayTimeArr(newPlayTimeArr);
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
                         onClick={() => handleLastPin(curPinIndex - 1)}>
                        <NavigateBeforeIcon />
                    </Fab>
                    <Fab color="default" aria-label="addPin"
                          onClick={() => handlePin()}>
                        <Icon classes={{ root: classes.iconRoot }}>
                            <img className={classes.imageIcon} src={pin} alt="" />
                        </Icon>          
                    </Fab>
                    <Fab color="default" aria-label="next" 
                          onClick={() => handleNextPin(curPinIndex + 1)} >
                        <NavigateNextIcon />      
                    </Fab>

                    <Typography>{"Current Pin Time: " + formatTime(playTimeArr[curPinIndex])}</Typography>
                    <Typography>{playTimeArr}</Typography>
                </div>
            </Paper>
        </Grid>
    );
};

export default AudioReview;