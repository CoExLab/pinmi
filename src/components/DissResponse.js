import React, {useState, useRef, useEffect} from 'react';
import {formatTime} from '../helper/index';
import { Box, Grid, Paper, TextField } from '@material-ui/core';
import {ToggleButton } from '@material-ui/lab';
import MISkillsSheet from './layout/MISkillsSheet';
import { makeStyles } from '@material-ui/core/styles';

// firebase hook
import { usePins } from '../hooks/index';
import { firebase } from "../hooks/firebase";

//context
import { useUserModeValue } from '../context';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(2),
        width: '45ch',
      },
    },
  }));

const DissResponse = ({curPinIndex}) => {   
    // user mode switcher
    const {userMode} = useUserModeValue();
    
    const classes = useStyles();
    
    //creating a refernce for TextField Component
    const noteValueRef = useRef('') 

    // fetch raw pin data here
    const { pins } = usePins();

    // set up states for four different questions
    const [curNoteInfo, setCurNoteInfo] = useState('');

    const [curPerspectiveInfo1, setCurPerspectiveInfo1] = useState('');
    const [curPerspectiveInfo2, setCurPerspectiveInfo2] = useState('');

    const [pinType1, setPinType1] = useState('');
    const [pinType2, setPinType2] = useState('');


    const [curSkillInfo1, setCurSkillInfo1] = useState('');
    const [curSkillInfo2, setCurSkillInfo2] = useState('');

    useEffect(() => {
        fetchCurTextVal(`${userMode}PinInfos.pinNote`);
        fetchCurTextVal(`InterviewerPinInfos.pinPerspective`);
        fetchCurTextVal(`ClientPinInfos.pinPerspective`);
        fetchCurTextVal(`InterviewerPinInfos.pinCategory`);
        fetchCurTextVal(`ClientPinInfos.pinCategory`);
        fetchCurTextVal(`InterviewerPinInfos.pinSkill`);
        fetchCurTextVal(`ClientPinInfos.pinSkill`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPinIndex, userMode])

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
        if(infoName === `${userMode}PinInfos.pinNote`){
            setCurNoteInfo(doc);
        } else if(infoName === `InterviewerPinInfos.pinPerspective`){
            setCurPerspectiveInfo1(doc);
        } else if(infoName === `ClientPinInfos.pinPerspective`){
            setCurPerspectiveInfo2(doc);
        } else if(infoName === `InterviewerPinInfos.pinCategory`){
            setPinType1(doc);
        } else if(infoName === `ClientPinInfos.pinCategory`){
            setPinType2(doc);
        } else if(infoName === `InterviewerPinInfos.pinSkill`){
            setCurSkillInfo1(doc);
        } else if(infoName === `ClientPinInfos.pinSkill`){
            setCurSkillInfo2(doc);
        }
    }

    // for pin information modifying
    const handlePinInfo = (infoName, input) => {
        if(infoName === `${userMode}PinInfos.pinNote`){
            setCurNoteInfo(input);
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

    return (
        <Grid item xs={12} sm={8}>
            <Paper >
                <h2>{userMode}</h2>
                {/* <Button variant="contained" onClick = {() => handleUserModeSwitch()}>userMode switcher</Button> */}
                <Box m={2} height={700} width = {800} overflow="auto" >
                    <Box fontStyle="italic" fontSize={18}>
                        Pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}
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
                        onChange = {() => handlePinInfo(`${userMode}PinInfos.pinNote`, noteValueRef.current.value)}
                    />
                    <Box my={1} fontStyle="italic" fontSize={18}> Talk with your peer about:</Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={2}> 
                        What is your perspective of what happened at this pin? 
                    </Box>
                    <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        id="outlined-secondary"
                        label="Interviewer's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"                        
                        value = {curPerspectiveInfo1}
                    />
                    <TextField
                        id="outlined-secondary"
                        label="Client's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"                        
                        value = {curPerspectiveInfo2}
                    />
                    </form>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={1}> 
                        What would you categorize this pin as?
                    </Box>
                    <form className={classes.root} noValidate autoComplete="off">
                        <ToggleButton >
                            {pinType1}
                        </ToggleButton>
                        <ToggleButton >
                            {pinType2}
                        </ToggleButton>
                    </form>
                    <MISkillsSheet />
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="outlined-secondary"
                            label="Interviewer's MI skill"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={1}
                            margin="normal"                        
                            value = {curSkillInfo1}
                        />
                        <TextField
                            id="outlined-secondary"
                            label="Client's MI skill"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={1}
                            margin="normal"                        
                            value = {curSkillInfo2}
                        />
                    </form>

                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={1}> 
                        Why was the pinned situation effective or ineffective?
                    </Box>  
                    <TextField
                        id="outlined-secondary"
                        label="Type a response..."
                        fullWidth
                        variant="outlined"
                        multiline
                        rowsMax={2}
                        margin="normal"                        
                        // value = {curSkillInfo}
                        // inputRef={skillValueRef}
                        // onChange = {() => handlePinInfo("pinInfos.pinSkill", skillValueRef.current.value)}
                    />
                </Box>
            </Paper>

        </Grid>
    );
};

export default DissResponse;