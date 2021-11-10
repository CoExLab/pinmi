import React, { useState, useRef, useEffect } from 'react';
import { formatTime } from '../helper/index';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { ColorLibNextButton, ColorLibBackButton } from './layout/ColorLibComponents/ColorLibButton';
import ColorLibPaper from './layout/ColorLibComponents/ColorLibPaper';
import ColorLibTextField from './layout/ColorLibComponents/ColorLibTextField';
import MISkillsSheet from './layout/MISkillsSheet';

// firebase hook
import { usePins } from '../hooks/index';
import { firebase } from "../hooks/firebase";

//context
import { useUserModeValue } from '../context';
import { useSessionValue, usePinsValue } from "../context";

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

const Notetaking = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
    //session values
    const { sessionID, mediaUrl: audio, setMediaUrl, setMediaDuration, mediaDuration: audioLen } = useSessionValue();
    // fetch raw pin data here
    const { pins } = usePinsValue();
    // user mode switcher
    const { userMode, userID } = useUserModeValue();
  
    const classes = useStyles();

    //creating a reference for TextField Component
    const player = useRef(null);
    const noteValueRef = useRef('')
    const perspectiveValueRef = useRef('')
    const skillValueRef = useRef('')

    // set up states for four different questions
    const [pinType, setPinType] = useState('');

    const [curNoteInfo, setCurNoteInfo] = useState('');
    const [curPerspectiveInfo, setCurPerspectiveInfo] = useState('');
    const [curSkillInfo, setCurSkillInfo] = useState('');

    const [pinBtnDisabled, setPinBtnDisabled] = useState(false);
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(0);
    const [loadURL, setLoadURL] = useState(false)

    // // back to last pin
    // const handleLastPin = (index) => {
    //     console.log(audio);
    //     console.log(audioLen);
    //     console.log(audioProgress);
    //     if (curPinIndex > 0) {
    //         setCurPinIndex(index);
    //         player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
    //     }
    // };

    // // go to next pin
    // const handleNextPin = (index, remove = false) => {
    //     if (curPinIndex < pins.map(pin => pin.pinTime).length - 1) {
    //         if (!remove) {
    //             player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
    //             setCurPinIndex(index);
    //         } else {
    //             player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
    //             setCurPinIndex(index - 1);
    //         }
    //     }
    // };



    const handlePrevPin = () => {
        setPrevPinIndex(curPinIndex);
        setCurPinIndex(curPinIndex - 1);
    }

    const handleNextPin = () => {
        setPrevPinIndex(curPinIndex);
        setCurPinIndex(curPinIndex + 1);
    }

    const PinNavButtons = () => {
        if (curPinIndex === -1)
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

        if (curPinIndex === 0) {
            return next;
        }
        if (curPinIndex === pins.length -1) {
            return prev;
        }
    return <div>{prev} {next}</div>;
    }


    const savePin = async (index) => {
        console.log("pins:" + pins + "\nindex: " + index);
        if (index >= 0 && index < pins.length) {
            const myPin = pins[index];
            if (myPin && userMode === "caller") {
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

    useEffect(() => {
        console.log("previous index: " + prevPinIndex);
        console.log("current index: " + curPinIndex);
        //update pin values
        setCurNoteInfo(noteValueRef.current.value);
        setCurPerspectiveInfo(perspectiveValueRef.current.value);
        setCurSkillInfo(skillValueRef.current.value);

        //pin info saved
        console.log("Current note: " + curNoteInfo);
        console.log("Perspective info: " + curPerspectiveInfo);
        console.log("Skill Info: " + curSkillInfo);

        //save pin info
        savePin(prevPinIndex);

        //clear out all the states
        if (pins[curPinIndex] && userMode === "caller") {
            setPinType(pins[curPinIndex].callerPinCategory);
            setCurNoteInfo(pins[curPinIndex].callerPinNote);
            setCurPerspectiveInfo(pins[curPinIndex].callerPinPerspective);
            setCurSkillInfo(pins[curPinIndex].callerPinSkill);
        } else if(pins[curPinIndex]){
            setPinType(pins[curPinIndex].calleePinCategory);
            setCurNoteInfo(pins[curPinIndex].calleePinNote);
            setCurPerspectiveInfo(pins[curPinIndex].calleePinPerspective);
            setCurSkillInfo(pins[curPinIndex].calleePinSkill);
        }
        //reset all the refs
        noteValueRef.current.value = curNoteInfo;
        perspectiveValueRef.current.value = curPerspectiveInfo;
        skillValueRef.current.value = curSkillInfo;
    }, [curPinIndex])

    // for pin information modifying
    const handlePinInfo = (infoName, input) => {
        if (infoName === `${userMode}PinInfos.pinNote`) {
            setCurNoteInfo(input);
        } else if (infoName === `${userMode}PinInfos.pinPerspective`) {
            setCurPerspectiveInfo(input);
        } else if (infoName === `${userMode}PinInfos.pinSkill`) {
            setCurSkillInfo(input);
        }
        // let usersUpdate = {};
        // usersUpdate[`${infoName}`] = input;
        // firebase
        //     .firestore()
        //     .collection("Pins")
        //     .doc(formatTime(pins.map(pin => pin.pinTime)[curPinIndex]))        
        //     .update(usersUpdate)    
        //     .then(() => {
        //         console.log("Document successfully updated!");
        //     })
        //     .catch((error) => {
        //         // The document probably doesn't exist.
        //         console.error("Error updating document: ", error);
        //     });
    }

    // for handling pin tyep switching
    const handlePinType = (event, newPinType) => {
        setPinType(newPinType);
        // handlePinInfo(`${userMode}PinInfos.pinCategory`, newPinType);
    };

    

    return (
        <Grid item xs={12} sm={8}>
            <ColorLibPaper elevation={1}>
                <Typography variant="h4" style={{ textTransform: 'capitalize' }}>
                    {userMode}
                </Typography>
                {curPinIndex !== -1 ?
                    <Box fontStyle="italic">
                        <Typography>
                            The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])} by {pins[curPinIndex].creatorMode === userMode ? "you" : "your peer"}
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