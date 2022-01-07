//The code in this page defines the text area components in the discussion prep page of the pin-mi app

import React, { useState, useRef, useEffect } from 'react';
import { formatTime } from '../../../helper/helper';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { ColorLibNextButton, ColorLibBackButton } from '../../components/colorLibComponents/ColorLibButton';
import ColorLibPaper from '../../components/colorLibComponents/ColorLibPaper';
import ColorLibTextField from '../../components/colorLibComponents/ColorLibTextField';
import MISkillsSheet from '../../components/MISkillsSheet';

//context
import { usePinsValue } from "../../../storage/context";

//style
const useStyles = makeStyles(theme => ({
    toggleGroup: {
        marginTop: '8px',
        marginBottom: '24px',
        width: '100%',
        height: '40px',
        '& .MuiToggleButton-root': {
            backgroundColor: 'white',
            borderColor: theme.palette.teal.main,
            borderWidth: '2px',
            color: theme.palette.teal.main,
            textTransform: 'none',
            width: '100%',
            '&.Mui-selected': {
                backgroundColor: theme.palette.teal.light,
            }
        },
        '& .MuiToggleButtonGroup-groupedHorizontal:first-child': {
            borderTopLeftRadius: '35px',
            borderBottomLeftRadius: '35px',
        },
        '& .MuiToggleButtonGroup-groupedHorizontal:last-child': {
            borderTopRightRadius: '35px',
            borderBottomRightRadius: '35px',
        },
        '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
            marginLeft: '3px',
        }
    },
}));

//actual export
//takes in state variables for the current pin index and the last pin index that was changed in order to 
// properly render and save pin information
const Notetaking = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
    // local pins array
    const { pins } = usePinsValue();
    //user information from redux
    const user = useSelector(state => state.user);
    //style
    const classes = useStyles();

    //creating a reference for TextField Component
    const noteValueRef = useRef('')
    const perspectiveValueRef = useRef('')
    const skillValueRef = useRef('')

    // set up states for four different questions
    const [pinType, setPinType] = useState('');
    const [curNoteInfo, setCurNoteInfo] = useState('');
    const [curPerspectiveInfo, setCurPerspectiveInfo] = useState('');
    const [curSkillInfo, setCurSkillInfo] = useState('');

    //handlePrevPin is called when the back button is hit
    //This function changes the pin indices to allow the user to switch to the pin marked prior to the current one
    const handlePrevPin = () => {
        setPrevPinIndex(curPinIndex);
        setCurPinIndex(curPinIndex - 1);
    }

    //handleNextPin is called when the forward button is hit
    //This function changes the pin indices to allow the user to switch to the pin marked ahead of the current one
    const handleNextPin = () => {
        setPrevPinIndex(curPinIndex);
        setCurPinIndex(curPinIndex + 1);
    }

    //Defines the rendering for the back and forward buttons that allow navigation between different pins
    const PinNavButtons = () => {
        //if there are 0 and only 1 pins, don't show prev and next
        if (curPinIndex === -1 || (pins.length === 1)) 
            return null;
        const prev = 
            <ColorLibBackButton 
                style={{margin: '0px 8px'}}
                variant="contained"
                size="small"
                onClick={handlePrevPin}
            >
                Prev Pin
            </ColorLibBackButton>
        const next = 
            <ColorLibNextButton 
                style={{margin: '0px 8px'}}
                variant="contained"
                size="small"
                onClick={handleNextPin}
            >
                Next Pin
            </ColorLibNextButton>
        //only return next when its the first pin and there are more pins 
        if (curPinIndex === 0 && (pins.length > 1)) {
            return next;
        }
        if ((curPinIndex === pins.length - 1) && (pins.length > 1)) {
            return prev;
        }
    return <div>{prev} {next}</div>;
    }

    //savePin takes in the array index of a pin in the pins array and updates the object at that index with 
    // information edited by the user
    const savePin = (index) => {
        if (index >= 0 && index < pins.length) {
            const myPin = pins[index];
            if (myPin && user.userMode === "caller") {
                myPin.callerPinNote = curNoteInfo;
                myPin.callerPinPerspective = curPerspectiveInfo;
                myPin.callerPinCategory = pinType;
                myPin.callerPinSkill = curSkillInfo;

                pins[index] = myPin;
            } else if(myPin) {
                myPin.calleePinNote = curNoteInfo;
                myPin.calleePinPerspective = curPerspectiveInfo;
                myPin.calleePinCategory = pinType;
                myPin.calleePinSkill = curSkillInfo;

                pins[index] = myPin;
            }
            console.log("Pin Edited: ")
            console.log(pins[index]);
        }
    }

    //this effect activates when the user navigates to a different pin
    useEffect(() => {
        console.log("previous index: " + prevPinIndex);
        console.log("current index: " + curPinIndex);
        
        //update pin values with the ones just edited by the user
        setCurNoteInfo(noteValueRef.current.value);
        setCurPerspectiveInfo(perspectiveValueRef.current.value);
        setCurSkillInfo(skillValueRef.current.value);

        console.log("Current note: " + curNoteInfo);
        console.log("Perspective info: " + curPerspectiveInfo);
        console.log("Skill Info: " + curSkillInfo);

        //save pin info in the local pins array
        savePin(prevPinIndex);

        //updates pin information states to render either the next or previous pin
        const nextPin = pins[curPinIndex];
        if (nextPin && user.userMode === "caller") {
            setPinType(nextPin.callerPinCategory);
            setCurNoteInfo(nextPin.callerPinNote);
            setCurPerspectiveInfo(nextPin.callerPinPerspective);
            setCurSkillInfo(nextPin.callerPinSkill);
        } else if(nextPin){
            setPinType(nextPin.calleePinCategory);
            setCurNoteInfo(nextPin.calleePinNote);
            setCurPerspectiveInfo(nextPin.calleePinPerspective);
            setCurSkillInfo(nextPin.calleePinSkill);
        }

        //reset all the refs
        noteValueRef.current.value = curNoteInfo;
        perspectiveValueRef.current.value = curPerspectiveInfo;
        skillValueRef.current.value = curSkillInfo;
    }, [ prevPinIndex, curPinIndex])

    // for handling pin type switching
    const handlePinType = (event, newPinType) => {
        setPinType(newPinType);
    };

    //Actual component rendering
    return (
        <Grid item xs={12} sm={8}>
            <ColorLibPaper elevation={1}>
                {curPinIndex !== -1 ?
                    <Box fontStyle="italic">
                        <Typography>
                            The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])} by {pins[curPinIndex].creatorMode === user.userMode ? "you" : "your peer"}
                        </Typography>
                    </Box>
                    : null}
                <ColorLibTextField
                    id="outlined-secondary"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    margin="normal"
                    label="Personal notes..."
                    value={curNoteInfo}
                    inputRef={noteValueRef}
                    onChange={() => { setCurNoteInfo(noteValueRef.current.value); }}
                />
                <Box fontStyle="italic" marginTop="16px"> 
                    <Typography variant = "h3">
                        To share with your peer:
                    </Typography>
                </Box>
                <Box textAlign="left" >
                    <Typography>
                        What is your perspective of what happened at this pin?
                    </Typography>
                </Box>
                <ColorLibTextField
                    id="outlined-secondary"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    margin="normal"
                    value={curPerspectiveInfo}
                    inputRef={perspectiveValueRef}
                    onChange={() => setCurPerspectiveInfo(perspectiveValueRef.current.value)}
                />
                <Box textAlign="left" >
                    <Typography>
                        What would you categorize this pin as?
                    </Typography>
                </Box>
                <Box align="left">
                    <ToggleButtonGroup
                        className={classes.toggleGroup}
                        value={pinType}
                        exclusive
                        onChange={handlePinType}
                        size="large"
                    >
                        <ToggleButton value="strength" selected={pinType === "strength"}>
                            Strength
                        </ToggleButton>
                        <ToggleButton value="opportunity" selected={pinType === "opportunity"}>
                            Opportunity
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <MISkillsSheet pinType={pinType} />
                <ColorLibTextField
                    id="outlined-secondary"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    margin="normal"
                    value={curSkillInfo}
                    inputRef={skillValueRef}
                    onChange={() => setCurSkillInfo(skillValueRef.current.value)}
                />

                <Box textAlign='center'>
                    <PinNavButtons />
                </Box>
            </ColorLibPaper>
        </Grid>
    );
};

export default Notetaking;