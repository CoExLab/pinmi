import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../helper/index';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import ColorLibPaper from './layout/ColorLibComponents/ColorLibPaper';
import ColorLibTextField from './layout/ColorLibComponents/ColorLibTextField';
import MISkillsSheet from './layout/MISkillsSheet';

// firebase hook
import { usePins } from '../hooks/index';
import { firebase } from "../hooks/firebase";

//context
import { useSessionValue, useUserModeValue } from '../context';
import { format } from 'url';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            width: '100%',
            '&:first-child': {
                marginRight: '8px',
            },
            '&:last-child': {
                marginLeft: '8px',
            }
        },
    },
}));

const DissResponse = ({ curPinIndex }) => {
    // user mode switcher
    const { userMode } = useUserModeValue();

    const classes = useStyles();

    //creating a refernce for TextField Component
    const noteValueRef = useRef('')

    //get sessionID
    const { sessionID } = useSessionValue();

    // fetch raw pin data here
    const [pins, setPins] = useState([]);

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
        fetchCurTextVal(`callerPinInfos.pinPerspective`);
        fetchCurTextVal(`calleePinInfos.pinPerspective`);
        fetchCurTextVal(`callerPinInfos.pinCategory`);
        fetchCurTextVal(`calleePinInfos.pinCategory`);
        fetchCurTextVal(`callerPinInfos.pinSkill`);
        fetchCurTextVal(`calleePinInfos.pinSkill`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPinIndex, userMode])

    useEffect(async () => {
        const tempPins = [];
        await firebase.firestore().collection("sessions").doc(sessionID).collection("pins").get().then(snap => snap.docs.map(doc => tempPins.push(doc.data())));
        setPins(tempPins);
    }, [pins]);

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
        if (infoName === `${userMode}PinInfos.pinNote`) {
            setCurNoteInfo(doc);
        } else if (infoName === `callerPinInfos.pinPerspective`) {
            setCurPerspectiveInfo1(doc);
        } else if (infoName === `calleePinInfos.pinPerspective`) {
            setCurPerspectiveInfo2(doc);
        } else if (infoName === `callerPinInfos.pinCategory`) {
            setPinType1(doc);
        } else if (infoName === `calleePinInfos.pinCategory`) {
            setPinType2(doc);
        } else if (infoName === `callerPinInfos.pinSkill`) {
            setCurSkillInfo1(doc);
        } else if (infoName === `calleePinInfos.pinSkill`) {
            setCurSkillInfo2(doc);
        }
    }

    // for pin information modifying
    const handlePinInfo = (infoName, input) => {
        if (infoName === `${userMode}PinInfos.pinNote`) {
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
            <ColorLibPaper >
                <Typography variant="h4" style={{ textTransform: 'capitalize' }}>
                    {userMode}
                </Typography>
                {/* <Button variant="contained" onClick = {() => handleUserModeSwitch()}>userMode switcher</Button> */}
                <Box fontStyle="italic">
                    <Typography>
                        Pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])}
                    </Typography>
                </Box>
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
                    inputRef={noteValueRef}
                    onChange={() => handlePinInfo(`${userMode}PinInfos.pinNote`, noteValueRef.current.value)}
                />
                <Box fontStyle="italic" marginTop="30px"> 
                    <Typography variant="h3">
                        Talk with your peer about:
                    </Typography>
                </Box>
                <Box textAlign="left">
                    <Typography>
                        What is your perspective of what happened at this pin?
                    </Typography>
                </Box>
                <form className={classes.root} noValidate autoCo
                mplete="off">
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="caller's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"
                        value={curPerspectiveInfo1}
                    />
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="callee's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        margin="normal"
                        value={curPerspectiveInfo2}
                    />
                </form>
                <Box textAlign="left">
                    <Typography>
                        What would you categorize this pin as?
                    </Typography>
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
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="caller's MI skill"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={1}
                        margin="normal"
                        value={curSkillInfo1}
                    />
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="callee's MI skill"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={1}
                        margin="normal"
                        value={curSkillInfo2}
                    />
                </form>

                <Box textAlign="left">
                    <Typography>
                        Why was the pinned situation effective or ineffective?
                        </Typography>
                </Box>
                <ColorLibTextField
                    id="outlined-secondary"
                    fullWidth
                    variant="outlined"
                    multiline
                    rowsMax={2}
                    margin="normal"
                // value = {curSkillInfo}
                // inputRef={skillValueRef}
                // onChange = {() => handlePinInfo("pinInfos.pinSkill", skillValueRef.current.value)}
                />
            </ColorLibPaper>

        </Grid>
    );
};

export default DissResponse;