import React, { useState, useRef, useEffect } from 'react';
import { formatTime } from '../helper/index';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
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
        marginBottom: '16px',
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

const Notetaking = ({ curPinIndex, setCurPinIndex }) => {
    const classes = useStyles();

    //creating a refernce for TextField Component
    const player = useRef(null);
    const noteValueRef = useRef('')
    const perspectiveValueRef = useRef('')
    const skillValueRef = useRef('')

    //session values
    const { sessionID, mediaUrl: audio, setMediaUrl, setMediaDuration, mediaDuration: audioLen } = useSessionValue();

    // fetch raw pin data here
    const { pins } = usePinsValue();

    // set up states for four different questions
    const [pinType, setPinType] = useState('');
    const [curNoteInfo, setCurNoteInfo] = useState('');
    const [curPerspectiveInfo, setCurPerspectiveInfo] = useState('');
    const [curSkillInfo, setCurSkillInfo] = useState('');
    const [pinBtnDisabled, setPinBtnDisabled] = useState(false);
    const [pinBtnColor, setPinBtnColor] = useState("");
    const [audioProgress, setAudioProgress] = useState(0);
    const [loadURL, setLoadURL] = useState(false)

    // user mode switcher
    const { userMode } = useUserModeValue();

    console.log(pins);

    // back to last pin
    const handleLastPin = (index) => {
        console.log(audio);
        console.log(audioLen);
        console.log(audioProgress);
        if (curPinIndex > 0) {
            setCurPinIndex(index);
            player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
        }
    };

    // go to next pin
    const handleNextPin = (index, remove = false) => {
        if (curPinIndex < pins.map(pin => pin.pinTime).length - 1) {
            if (!remove) {
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                setCurPinIndex(index);
            } else {
                player.current.seekTo(parseFloat(pins.map(pin => pin.pinTime)[index]));
                setCurPinIndex(index - 1);
            }
        }
    };

    const savePin = async (index) => {
        console.log("pins:" + pins + "\nindex: " + index);
        if (index >= 0) {
            const myPin = pins[index];
            if (myPin) {
                myPin.pinInfos.pinNote = curNoteInfo;
                myPin.pinInfos.pinPersepective = curPerspectiveInfo;
                myPin.pinInfos.pinCategory = pinType;
                myPin.pinInfos.pinSkill = curSkillInfo;
                pins[index] = myPin;
            }
        }
    }

    useEffect(() => {
        console.log("Current pin Index: ", curPinIndex);
        //update pin values
        setCurNoteInfo(noteValueRef.current.value);
        setCurPerspectiveInfo(perspectiveValueRef.current.value);
        setCurSkillInfo(skillValueRef.current.value);
        //save pin info
        savePin(curPinIndex);
        //clear out all the states
        if (pins[curPinIndex]) {
            setPinType(pins[curPinIndex].pinInfos.pinCategory);
            setCurNoteInfo(pins[curPinIndex].pinInfos.pinNote);
            setCurPerspectiveInfo(pins[curPinIndex].pinInfos.pinPersepective);
            setCurSkillInfo(pins[curPinIndex].pinInfos.pinSkill);
        }
        //reset all the refs
        noteValueRef.current.value
            = curNoteInfo;
        perspectiveValueRef.current.value = curPerspectiveInfo;
        skillValueRef.current = curSkillInfo;
    }, [curPinIndex])


    // for updating and fetching current text field value
    const fetchCurTextVal = async (infoName) => {
        return
        const docId = pins[curPinIndex].pinID;
        const docRef = await firebase.firestore().collection("sessions").doc(sessionID).collection('pins').doc(pins[curPinIndex].pinID);
        const infos = infoName.split(".");
        let curInfo = "";
        const doc = await docRef.get().then((doc) => {
            if (doc.exists) {
                curInfo = doc.data()[infos[1]];
                return curInfo;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
        if (infoName === `${userMode}PinInfos.pinNote`) {
            setCurNoteInfo(doc);
        } else if (infoName === `${userMode}PinInfos.pinPerspective`) {
            setCurPerspectiveInfo(doc);
        } else if (infoName === `${userMode}PinInfos.pinCategory`) {
            setPinType(doc);
        } else if (infoName === `${userMode}PinInfos.pinSkill`) {
            setCurSkillInfo(doc);
        }
    }

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
                            The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}
                        </Typography>
                    </Box>
                    : null}
                {/* <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium">
                    Personal Notes
                </Box> */}
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
                    onChange={() => { setCurNoteInfo(noteValueRef.current.value); console.log("cur: " + curNoteInfo); }}
                />
                <Box fontStyle="italic" marginTop="30px"> 
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
                    rows={3}
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
                    rowsMax={2}
                    margin="normal"
                    value={curSkillInfo}
                    inputRef={skillValueRef}
                    onChange={() => setCurSkillInfo(skillValueRef.current.value)}
                />
            </ColorLibPaper>
        </Grid>
    );
};

export default Notetaking;