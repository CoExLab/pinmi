import { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Grid, Icon, IconButton, ListItemIcon, Paper, Slider, Typography } from '@material-ui/core';

import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';

import pin from '../../../other/pin.svg';

const pinButton = (pinTime, setCurrentTime) => (
    <Fab 
        style={{top: '10px'}}
        size="small"
        onClick={() => 
            setCurrentTime(Math.max(pinTime-10, 0))
        }
    >
        <Icon>
            <img src={pin} alt="pin" style={{height: '100%'}} />
        </Icon>
    </Fab>
);

const displayTime = (secs) => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.floor(secs % 60);

    // Convert to 2-digit string
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${seconds}`;
};

const getIconByPlayerStatus = (playerStatus, setPlayerStatus) => {
    const ColorLibIconButton = withStyles((theme) => ({
        root: {
            color: theme.palette.teal.main,
            padding: '12px',
        },
        label: {
            '& .MuiSvgIcon-root': {
                width: '50px',
                height: '50px',
            },
        }
    }))(IconButton);

    return (
        <ColorLibIconButton
            onClick={() => setPlayerStatus(!playerStatus)}
        >
            {playerStatus ? <PauseRoundedIcon /> : <PlayArrowOutlinedIcon />}
        </ColorLibIconButton>
    );
};

const ColorLibAudioSlider = withStyles((theme) => ({
    marked: {
        marginBottom: '0px',
    },
    thumb: {
        borderRadius: '0',
        color: 'black',
        height: '48px',
        marginTop: '-23px',
        marginLeft: '-2px',
        width: '4px',
        boxShadow: 'none !important',
        '&::after': {
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
        }
    },
    root: {
        height: '6px',
    },
    rail: {
        height: '6px',
        color: theme.palette.teal.light,
        opacity: '100%',
    },
    track: {
        height: '6px',
        color: theme.palette.teal.main,
    },
    mark: {
        height: '6px',
        width: '30px',
        borderRadius: '6px',
        backgroundColor: theme.palette.pink.main,
        marginLeft: '-15px',
        opacity: 0.6,
    },
}))(Slider);

const ColorLibAudioPlayer = ({
    playerStatus,
    setPlayerStatus,
    currentTime,
    setCurrentTime,
    duration,
    marks // List of integers, each in seconds
}) => {

    const pinMarks = marks.map(markTime => ({
        value: markTime,
        label: pinButton(markTime, setCurrentTime),
    }));
    return (
        <Grid container style={{paddingBottom: '50px'}}>
            <Grid item xs={1}>
                {getIconByPlayerStatus(playerStatus, setPlayerStatus)}
            </Grid>

            <Grid item xs={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="body2">
                    {displayTime(currentTime)}
                </Typography>
            </Grid>
            
            <Grid item xs={9} style={{alignItems: 'center'}}>
                <ColorLibAudioSlider
                    value = {currentTime}
                    onChange = {(event, newValue) => setCurrentTime(newValue)}
                    max = {duration}
                    step = {1}
                    marks = {pinMarks}
                />
            </Grid>

            <Grid item xs={1} style={{alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="body2">
                    {displayTime(duration)}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default ColorLibAudioPlayer;