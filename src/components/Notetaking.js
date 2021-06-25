import React, {useState, useRef, useEffect} from 'react';
import {formatTime} from '../helper/index';
import { Box, Grid, Paper, TextField } from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import MISkillsSheet from './layout/MISkillsSheet';

// firebase hook
import { usePins } from '../hooks/index';
import { firebase } from "../hooks/firebase";

const Notetaking = ({curPinIndex}) => {    
    //creating a refernce for TextField Component
    const noteValueRef = useRef('') 
    const perspectiveValueRef = useRef('')
    const skillValueRef = useRef('')

    // fetch raw pin data here
    const { pins } = usePins();

    // set up states for four different questions
    const [pinType, setPinType] = useState('');
    const [curNoteInfo, setCurNoteInfo] = useState('');
    const [curPerspectiveInfo, setCurPerspectiveInfo] = useState('');
    const [curSkillInfo, setCurSkillInfo] = useState('');

    useEffect(() => {
        fetchCurTextVal("pinInfos.pinNote");
        fetchCurTextVal("pinInfos.pinPerspective");
        fetchCurTextVal("pinInfos.pinCategory");
        fetchCurTextVal("pinInfos.pinSkill");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPinIndex])

    // for updating and fetching current text field value
    const fetchCurTextVal = async (infoName) => {
        const docRef = await firebase.firestore().collection("Pins").doc(formatTime(pins.map(pin => pin.pinTime)[curPinIndex]));
        const infos = infoName.split(".");
        let curInfo = "";
        const doc = await docRef.get().then((doc) => {
            if (doc.exists) {
                curInfo = doc.data()[infos[0]][infos[1]];
                return curInfo;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
        if(infoName === "pinInfos.pinNote"){
            setCurNoteInfo(doc);
        } else if(infoName === "pinInfos.pinPerspective"){
            setCurPerspectiveInfo(doc);
        } else if(infoName === "pinInfos.pinCategory"){
            setPinType(doc);
        } else if(infoName === "pinInfos.pinSkill"){
            setCurSkillInfo(doc);
        } 
    }

    // for pin information modifying
    const handlePinInfo = (infoName, input) => {
        if(infoName === "pinInfos.pinNote"){
            setCurNoteInfo(input);
        } else if(infoName === "pinInfos.pinPerspective"){
            setCurPerspectiveInfo(input);
        } else if(infoName === "pinInfos.pinSkill"){
            setCurSkillInfo(input);
        } 
        let usersUpdate = {};
        usersUpdate[`${infoName}`] = input;
        firebase
            .firestore()
            .collection("Pins")
            .doc(formatTime(pins.map(pin => pin.pinTime)[curPinIndex]))        
            .update(usersUpdate)    
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    // for handling pin tyep switching
    const handlePinType = (event, newPinType) => {
        setPinType(newPinType);
        handlePinInfo("pinInfos.pinCategory", newPinType);
    };  

    return (
        <Grid item xs={12} sm={8}>
            <Paper >
                <Box m={2} height={700} >
                    <Box fontStyle="italic" fontSize={18}>
                        The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={2}> 
                        Would you like to take some notes for this pin?
                    </Box>
                    <TextField
                        id="outlined-secondary"
                        label="Personal Notes..."
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"
                        value = {curNoteInfo}
                        inputRef={noteValueRef}
                        onChange = {() => handlePinInfo("pinInfos.pinNote", noteValueRef.current.value)}
                    />
                    <Box my={1} fontStyle="italic" fontSize={18}> To share with your peer:</Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={2}> 
                        What is your perspective of what happened at this pin? 
                    </Box>
                    <TextField
                        id="outlined-secondary"
                        label="Type a response..."
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"                        
                        value = {curPerspectiveInfo}
                        inputRef={perspectiveValueRef}
                        onChange = {() => handlePinInfo("pinInfos.pinPerspective", perspectiveValueRef.current.value)}
                    />
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={2}> 
                        What would you categorize this pin as?
                    </Box>       
                    <Box align="left" m = {3}>          
                        <ToggleButtonGroup
                            value={pinType}
                            exclusive
                            onChange={handlePinType}
                            size = "large"
                        >
                            <ToggleButton value="strength" selected = {pinType === "strength"}>
                                Strength
                            </ToggleButton>
                            <ToggleButton value="opportunity" selected = {pinType === "opportunity"}>
                                Opportunity
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>   
                    <MISkillsSheet />
                    <TextField
                        id="outlined-secondary"
                        label="Type a response..."
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={1}
                        margin="normal"                        
                        value = {curSkillInfo}
                        inputRef={skillValueRef}
                        onChange = {() => handlePinInfo("pinInfos.pinSkill", skillValueRef.current.value)}
                    />
                </Box>
            </Paper>

        </Grid>
    );
};

export default Notetaking;