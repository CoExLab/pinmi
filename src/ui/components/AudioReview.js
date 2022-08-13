import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
//import audio from '../other/audio.mp3';
import ColorLibAudioPlayer from './colorLibComponents/ColorLibAudioPlayer';

// context
import { useActiveStepValue, useSessionValue, usePinsValue } from '../../storage/context';

// firebase hook

const AudioReview = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
  const player = useRef(null);
  const { curActiveStep } = useActiveStepValue();
  //session data
  const { mediaUrl: audio, mediaDuration: audioLen } = useSessionValue();
  // fetch raw pin data here
  const { pins } = usePinsValue();
  // console.log(pins);
  //fetch user data
  const user = useSelector(state => state.user);
  const session = useSelector(state => state.session);

  // get document ID

  // hard-coded sessionID here

  //first pin (either -1 if there isn't one, or an actual value)
  const AudioProgressStartingValue = pinsArray => {
    //if there are pins to load,
    if (pinsArray.length > 0) {
      return pinsArray[0].pinTime; // Math.max(0, pinsArray[0].pinTime - 10);
    } else {
      return 0;
    }
  };

  // const { mediaURL: audio, setMediaURL } = useMediaURL();

  const [pinBtnDisabled, setPinBtnDisabled] = useState(false);
  const [pinBtnColor, setPinBtnColor] = useState('');

  const [audioProgress, setAudioProgress] = useState(AudioProgressStartingValue(pins));
  useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    let time = 0;
    if (AudioProgressStartingValue(pins) === 0) {
    } else {
      time = Math.max(0, pins[curPinIndex].pinTime);
    }

    setAudioProgress(time);
    player.current.seekTo(time);
    console.log('Audio Progress set to: ' + time + ' in useEffect');
    console.log('Audio from AudioReview useEffect ' + audio);
  }, [curPinIndex, audio, pins]);

  //list of all pin times
  //let playTimeArr = pins.map(pin => pin.pinTime);

  const addPin = async curTime => {
    // ui on
    setPinBtnDisabled(true);
    setPinBtnColor('primary');
    // ui off
    setTimeout(() => {
      setPinBtnDisabled(false);
    }, 800);

    //create a newPin object to house pin details
    const newPin = {
      pinID: '',
      creatorID: user.userID,
      creatorMode: user.userMode,
      pinTime: curTime,
      callerPinNote: '',
      callerPinPerspective: '',
      callerPinCategory: '',
      callerPinSkill: '',
      calleePinNote: '',
      calleePinPerspective: '',
      calleePinCategory: '',
      calleePinSkill: '',
      callerPinGoal: '',
      callerPinStrength: '',
      callerPinOpportunity: '',
      calleePinGoal: '',
      calleePinStrength: '',
      calleePinOpportunity: '',
    };

    //now correctly add the pin into the array to maintain sortedness
    pins.splice(curPinIndex + 1, 0, newPin);

    //update the current pin index so it points to the newly created pin
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(curPinIndex + 1);
  };

  const handleAudioProgress = currentTime => {
    setAudioProgress(currentTime);
    console.log('Current Time in AR: ' + currentTime);
    if (player.current != null) {
      player.current.seekTo(currentTime);
    }
    // If the audio progress is near a pin, set the pin index to it.
    const newIndex = pins.findIndex(elem => Math.abs(elem.pinTime - currentTime) <= Math.max(1, audioLen / 50));
    if (newIndex !== -1) {
      setPrevPinIndex(curPinIndex);
      setCurPinIndex(newIndex);
    }
  };

  return (
    <Grid item xs={12}>
      {curActiveStep === 2 ? (
        <Typography variant="h6">
          Listen back to the session, add pins, and take notes to discuss with your peer.
        </Typography>
      ) : (
        <>{session.recordOnly !== true && <Typography variant="h6">Review all pins with your peer</Typography>}</>
      )}
      <ColorLibAudioPlayer
        playerStatus={audioPlaying}
        setPlayerStatus={setAudioPlaying}
        currentTime={audioProgress}
        setCurrentTime={handleAudioProgress}
        duration={audioLen}
        marks={pins.map(pin => {
          return { markTime: pin.pinTime, creatorMode: pin.creatorMode };
        })}
        addPin={addPin}
        recordOnlyMode={session.recordOnly === true}
      />
      <ReactPlayer
        hidden
        playing={audioPlaying}
        ref={player}
        url={audio}
        controls={true}
        width="100%"
        height="55px"
        style={{ marginBottom: 8 }}
        onProgress={state => {
          if (state.playedSeconds) setAudioProgress(state.playedSeconds);
        }}
        onSeek={sec => {
          setAudioProgress(sec);
        }}
      />
    </Grid>
  );
};

export default AudioReview;
