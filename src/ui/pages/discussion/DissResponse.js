//This code file defines the text area component for each pin rendered in the Collaboration file

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../../../helper/helper';
import { Box, Grid, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { ColorLibNextButton, ColorLibBackButton } from '../../components/colorLibComponents/ColorLibButton';
import ColorLibPaper from '../../components/colorLibComponents/ColorLibPaper';
import ColorLibTextField from '../../components/colorLibComponents/ColorLibTextField';
import MISkillsSheet from '../../components/MISkillsSheet';

//context
import { usePinsValue } from '../../../storage/context';

//style
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      width: '100%',
      '&:first-child': {
        marginRight: '8px',
      },
      '&:last-child': {
        marginLeft: '8px',
      },
    },
  },
}));

//actual export
//takes in state variables for the current pin index and the last pin index that was changed in order to
// properly render and save pin information
const DissResponse = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
  //style
  const classes = useStyles();

  // user information fetched from Redux
  const user = useSelector(state => state.user);

  //creating a refernce for TextField Components
  const goalValueRef = useRef('');
  const strengthValueRef = useRef('');
  const opportunityValueRef = useRef('');

  //local pins array
  const { pins } = usePinsValue();

  // set up states for four different questions
  const [curNoteInfo, setCurNoteInfo] = useState('');

  const [curPerspectiveInfo1, setCurPerspectiveInfo1] = useState('');
  const [curPerspectiveInfo2, setCurPerspectiveInfo2] = useState('');

  const [pinType1, setPinType1] = useState('');
  const [pinType2, setPinType2] = useState('');

  const [curSkillInfo1, setCurSkillInfo1] = useState('');
  const [curSkillInfo2, setCurSkillInfo2] = useState('');

  //This function either returns the pin specified by curPinIndex, or returns an empty string to handle
  //the empty pin array case
  const getCurrentPinInfo = () => {
    if (pins.length > 0) {
      return pins[curPinIndex];
    } else {
      //if there are no pins the array, return an empty string.
      return '';
    }
  };

  //states defined for each of the text input areas
  const [curGoalInfo, setCurGoalInfo] = useState(getCurrentPinInfo());
  const [curStrengthInfo, setCurStrengthInfo] = useState(getCurrentPinInfo());
  const [curOpporunityInfo, setCurOpportunityInfo] = useState(getCurrentPinInfo());

  //savePin takes in the array index of a pin in the pins array and updates the object at that index with
  // information edited by the user
  const savePin = index => {
    const lastPin = pins[index];
    if (user.userMode === 'caller') {
      lastPin.callerPinGoal = curGoalInfo;
      lastPin.callerPinStrength = curStrengthInfo;
      lastPin.callerPinOpportunity = curOpporunityInfo;
    } else {
      lastPin.calleePinGoal = curGoalInfo;
      lastPin.calleePinStrength = curStrengthInfo;
      lastPin.calleePinOpportunity = curOpporunityInfo;
    }
    pins[index] = lastPin;
  };

  //this effect activates when the user navigates to a different pin. It is used to save information related to the
  // current pin and update the information rendered to represent the pin navigated to (either the next or previous pin)
  useEffect(() => {
    if (pins.length > 0) {
      //retrieve the non-editable pin information for the new pin
      fetchCurTextVal();

      //update state values with the most recent information from the user
      setCurGoalInfo(goalValueRef.current.value);
      setCurStrengthInfo(strengthValueRef.current.value);
      setCurOpportunityInfo(opportunityValueRef.current.value);

      //find the pin just edited
      const lastPin = pins[prevPinIndex];
      if (lastPin) {
        savePin(prevPinIndex);
      }

      //get the pin recently navigated to and update the state values to represent information from that pin
      const nextPin = pins[curPinIndex];
      console.log(lastPin);
      if (nextPin && user.userMode === 'caller') {
        setCurGoalInfo(nextPin.callerPinGoal);
        setCurStrengthInfo(nextPin.callerPinStrength);
        setCurOpportunityInfo(nextPin.callerPinOpportunity);
      } else if (nextPin) {
        setCurGoalInfo(nextPin.calleePinGoal);
        setCurStrengthInfo(nextPin.calleePinStrength);
        setCurOpportunityInfo(nextPin.calleePinOpportunity);
      } else {
        console.log('???');
      }

      //reset all the refs
      goalValueRef.current.value = curGoalInfo;
      strengthValueRef.current.value = curStrengthInfo;
      opportunityValueRef.current.value = curOpporunityInfo;
    }
  }, [curPinIndex, prevPinIndex]); //curPinIndex shouldn't change if there are not pins.

  // for updating and fetching current text field value
  const fetchCurTextVal = async () => {
    let curPin = pins[curPinIndex];

    if (user.userMode === 'caller') setCurNoteInfo(curPin.callerPinNote);
    else setCurNoteInfo(curPin.calleePinNote);

    setCurPerspectiveInfo1(curPin.callerPinPerspective);
    setCurPerspectiveInfo2(curPin.calleePinPerspective);

    setPinType1(curPin.callerPinCategory);
    setPinType2(curPin.calleePinCategory);

    setCurSkillInfo1(curPin.callerPinSkill);
    setCurSkillInfo2(curPin.calleePinSkill);
  };

  //called when the previous button is hit. This changes the pin index states to represent the new pin
  const handlePrevPin = () => {
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(curPinIndex - 1);
  };

  //called when the next button is hit. This changes the pin index states to represent the new pin
  const handleNextPin = () => {
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(curPinIndex + 1);
  };

  //This function defines the rendering of the previous and next buttons depending on pin the user is on
  const PinNavButtons = () => {
    if (curPinIndex === -1) return null;
    const prev = (
      <ColorLibBackButton style={{ margin: '0px 8px' }} variant="contained" size="small" onClick={handlePrevPin}>
        Prev Pin
      </ColorLibBackButton>
    );
    const next = (
      <ColorLibNextButton style={{ margin: '0px 8px' }} variant="contained" size="small" onClick={handleNextPin}>
        Next Pin
      </ColorLibNextButton>
    );

    if (curPinIndex === 0) {
      return next;
    }
    if (curPinIndex === pins.length - 1) {
      return prev;
    }
    return (
      <Fragment>
        {' '}
        {prev} {next}{' '}
      </Fragment>
    );
  };

  //Actual rendering
  return (
    <Grid item xs={12} sm={8}>
      {curPinIndex !== -1 ? (
        <ColorLibPaper elevation={1}>
          {curPinIndex !== -1 ? (
            <Box fontStyle="italic">
              <Typography>
                The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])} by{' '}
                {pins[curPinIndex].creatorMode === 'default'
                  ? 'default'
                  : pins[curPinIndex].creatorMode === user.userMode
                  ? 'you'
                  : 'your peer'}
              </Typography>
            </Box>
          ) : null}
          <ColorLibTextField
            disabled
            id="outlined-secondary"
            label="Personal Notes..."
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={curNoteInfo}
          />
          <Box fontStyle="italic" marginTop="16px">
            <Typography variant="h3">Talk with your peer about:</Typography>
          </Box>

          <Box textAlign="left">
            <Typography>What is your perspective of what happened at this pin?</Typography>
          </Box>
          <form className={classes.root} noValidate autoComplete="off">
            <ColorLibTextField
              disabled
              id="outlined-secondary"
              label="Therapist's perspective"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              margin="normal"
              value={curPerspectiveInfo1}
            />
            <ColorLibTextField
              disabled
              id="outlined-secondary"
              label="Client's perspective"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              margin="normal"
              value={curPerspectiveInfo2}
            />
          </form>
          <Box textAlign="left">
            <Typography>What would you categorize this pin as?</Typography>
          </Box>
          <Box align="left">
            <ToggleButtonGroup disabled className={classes.toggleGroup} exclusive size="large">
              <ToggleButton value={pinType1 ?? 'pinType1'}>{pinType1}</ToggleButton>
              <ToggleButton value={pinType2 ?? 'pinType2'}>{pinType2}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <MISkillsSheet />
          <form className={classes.root} noValidate autoComplete="off">
            <ColorLibTextField
              disabled
              label="Therapist's MI skill"
              id="outlined-secondary"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              margin="normal"
              value={curSkillInfo1}
            />
            <ColorLibTextField
              disabled
              label="Client's MI skill"
              id="outlined-secondary"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              margin="normal"
              value={curSkillInfo2}
            />
          </form>

          <Box textAlign="left">
            <Typography>What was the therapist trying to achieve during this pin?</Typography>
          </Box>
          <ColorLibTextField
            id="outlined-secondary"
            label="Type a response..."
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={curGoalInfo}
            inputRef={goalValueRef}
            onChange={() => setCurGoalInfo(goalValueRef.current.value)}
          />

          <Box textAlign="left">
            <Typography>What worked well to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            id="outlined-secondary"
            label="Type a response..."
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={curStrengthInfo}
            inputRef={strengthValueRef}
            onChange={() => setCurStrengthInfo(strengthValueRef.current.value)}
          />

          <Box textAlign="left">
            <Typography>What could be improved to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            id="outlined-secondary"
            label="Type a response..."
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={curOpporunityInfo}
            inputRef={opportunityValueRef}
            onChange={() => setCurOpportunityInfo(opportunityValueRef.current.value)}
          />

          {/* <Box textAlign="center">
            <PinNavButtons />
          </Box> */}
        </ColorLibPaper>
      ) : (
        <Box fontStyle="italic">
          <Typography>
            {'\n'}No pins to see. Try adding some!!!{'\n\n'}
          </Typography>
        </Box>
      )}
    </Grid>
  );
};

export default DissResponse;
