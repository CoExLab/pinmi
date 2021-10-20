import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../helper/index';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
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

const DissResponse = ({ curPinIndex, prevPinIndex }) => {
    // user mode switcher
    const { userMode } = useUserModeValue();

    const classes = useStyles();

    //creating a refernce for TextField Component
    const noteValueRef = useRef('')

    //get sessionID
    const { sessionID } = useSessionValue();

    const { pins } = usePinsValue();

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

    const [curGoalInfo1, setCurGoalInfo1] = useState('');
    const [curGoalInfo2, setCurGoalInfo2] = useState('');

    const [curStrengthInfo1, setCurStrengthInfo1] = useState('');
    const [curStrengthInfo2, setCurStrengthInfo2] = useState('');

    const [curOpportunityInfo1, setCurOpportunityInfo1] = useState('');
    const [curOpportunityInfo2, setCurOpportunityInfo2] = useState('');

    const [curEfficacyInfo, setCurEfficacyInfo] = useState(pins[curPinIndex].pinEfficacy);

    useEffect(() => {
        fetchCurTextVal();
        pins[prevPinIndex].pinEfficacy = curEfficacyInfo;
        setCurEfficacyInfo(pins[curPinIndex].pinEfficacy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curPinIndex])


    // for updating and fetching current text field value
    const fetchCurTextVal = async (infoName) => {
        let curPin = pins[curPinIndex];

        if (userMode === "caller")
            setCurNoteInfo(curPin.callerPinNote);
        else
            setCurNoteInfo(curPin.calleePinNote);

        setCurPerspectiveInfo1(curPin.callerPinPerspective);
        setCurPerspectiveInfo2(curPin.calleePinPerspective);

        setPinType1(curPin.callerPinCategory);
        setPinType2(curPin.calleePinCategory);

        setCurSkillInfo1(curPin.callerPinSkill);
        setCurSkillInfo2(curPin.calleePinSkill);

        setCurGoalInfo1(curPin.callerPinGoal);
        setCurGoalInfo2(curPin.calleePinGoal);

        setCurStrengthInfo1(curPin.callerPinStrength);
        setCurStrengthInfo2(curPin.calleePinStrength);

        setCurOpportunityInfo1(curPin.callerPinOpportunity);
        setCurOpportunityInfo2(curPin.calleePinOpportunity);
    }

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
                    onChange={() => console.log("invalid")}
                />
                <Box fontStyle="italic" marginTop="16px">
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
                        rows={2}
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
                        rows={2}
                        margin="normal"
                        value={curPerspectiveInfo2}
                    />
                </form>
                <Box textAlign="left">
                    <Typography>
                        What would you categorize this pin as?
                    </Typography>
                </Box>
                <Box align="left">
                    <ToggleButtonGroup
                        disabled
                        className={classes.toggleGroup}
                        exclusive
                        size="large"
                    >
                        <ToggleButton >
                            {pinType1}
                        </ToggleButton>
                        <ToggleButton >
                            {pinType2}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <MISkillsSheet />
                <form className={classes.root} noValidate autoComplete="off">
                    <ColorLibTextField
                        disabled
                        label="caller's MI skill"
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
                        label="callee's MI skill"
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
                    <Typography>
                        What was the goal during the pinned situation?
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
                        rows={2}
                        margin="normal"
                        value={curGoalInfo1}
                    />
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="callee's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                        margin="normal"
                        value={curGoalInfo2}
                    />
                </form>

                <Box textAlign="left">
                    <Typography>
                        What worked well to achieve the goal?
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
                        rows={2}
                        margin="normal"
                        value={curStrengthInfo1}
                    />
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="callee's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                        margin="normal"
                        value={curStrengthInfo2}
                    />
                </form>

                <Box textAlign="left">
                    <Typography>
                        What could be improved to achieve the goal?
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
                        rows={2}
                        margin="normal"
                        value={curOpportunityInfo1}
                    />
                    <ColorLibTextField
                        disabled
                        id="outlined-secondary"
                        label="callee's perspective"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                        margin="normal"
                        value={curOpportunityInfo2}
                    />
                </form>

                <Box textAlign="left">
                    <Typography>
                        Why was the pinned situation effective or ineffective?
                    </Typography>
                </Box>
                <ColorLibTextField
                    id="outlined-secondary"
                    label="Personal Notes..."
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    margin="normal"
                    value={curEfficacyInfo}
                    inputRef={noteValueRef}
                    onChange={() => setCurEfficacyInfo(noteValueRef.current.value)}
                />
            </ColorLibPaper>
        </Grid>
    );
};

export default DissResponse;