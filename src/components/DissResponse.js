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
import { useSessionValue, useUserModeValue, usePinsValue } from '../context';
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

    const {pins} = usePinsValue();

    // // fetch raw pin data here
    // const [pins, setPins] = useState([]);

    // set up states for four different questions
    const [curNoteInfo, setCurNoteInfo] = useState('');

    const [curPerspectiveInfo1, setCurPerspectiveInfo1] = useState('');
    const [curPerspectiveInfo2, setCurPerspectiveInfo2] = useState('');

    const [pinType1, setPinType1] = useState('');
    const [pinType2, setPinType2] = useState('');


    const [curSkillInfo1, setCurSkillInfo1] = useState('');
    const [curSkillInfo2, setCurSkillInfo2] = useState('');

    useEffect(() => {
        fetchCurTextVal(`pinNote`);
        fetchCurTextVal(`callerPinInfos.pinPerspective`);
        fetchCurTextVal(`calleePinInfos.pinPerspective`);
        fetchCurTextVal(`callerPinInfos.pinCategory`);
        fetchCurTextVal(`calleePinInfos.pinCategory`);
        fetchCurTextVal(`callerPinInfos.pinSkill`);
        fetchCurTextVal(`calleePinInfos.pinSkill`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPinIndex])


    // for updating and fetching current text field value
    const fetchCurTextVal = async (infoName) => {
        let curPin = pins[curPinIndex];
        if (infoName === `pinNote` && userMode == "caller") {
            setCurNoteInfo(curPin.callerPinNote);
        } else if (infoName === `pinNote` ){
            setCurNoteInfo(curPin.calleePinNote);
        } else if (infoName === `callerPinInfos.pinPerspective`) {
            setCurPerspectiveInfo1(curPin.callerPinPerspective);
        } else if (infoName === `calleePinInfos.pinPerspective`) {
            setCurPerspectiveInfo2(curPin.calleePinPerspective);
        } else if (infoName === `callerPinInfos.pinCategory`) {
            setPinType1(curPin.callerPinCategory);
        } else if (infoName === `calleePinInfos.pinCategory`) {
            setPinType2(curPin.calleePinCategory);
        } else if (infoName === `callerPinInfos.pinSkill`) {
            setCurSkillInfo1(curPin.callerPinSkill);
        } else if (infoName === `calleePinInfos.pinSkill`) {
            setCurSkillInfo2(curPin.calleePinSkill);
        }
    }

    // for pin information modifying
    const handlePinInfo = (input) => {
        pins[curPinIndex].pinEfficacy = input;
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
                        Pinned at {formatTime(pins[curPinIndex].pinTime)}
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
                    disabled
                    id="outlined-secondary"
                    label="Personal Notes..."
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    margin="normal"
                    value={pins[curPinIndex].pinEfficacy}
                    inputRef={noteValueRef}
                    onChange={() => handlePinInfo(noteValueRef.current.value)}
                />
            </ColorLibPaper>

        </Grid>
    );
};

export default DissResponse;