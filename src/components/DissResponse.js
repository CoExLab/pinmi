import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../helper/index';
import { Box, Grid, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { ColorLibNextButton, ColorLibBackButton } from './layout/ColorLibComponents/ColorLibButton';
import ColorLibPaper from './layout/ColorLibComponents/ColorLibPaper';
import ColorLibTextField from './layout/ColorLibComponents/ColorLibTextField';
import MISkillsSheet from './layout/MISkillsSheet';


//context
import { usePinsValue } from '../context';

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

const DissResponse = ({ curPinIndex, setCurPinIndex, prevPinIndex, setPrevPinIndex }) => {
    // user mode switcher
    const user = useSelector(state => state.user);

    const classes = useStyles();

    //creating a refernce for TextField Components
    const goalValueRef = useRef('')
    const strengthValueRef = useRef('')
    const opportunityValueRef = useRef('')

    //get sessionID
    //const { sessionID } = useSessionValue();

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

    //This function handles the empty pin array case
    const getCurrentPinInfo = (pinInfo) => {
        if (pins.length>0){
            return pins[curPinIndex];
        }
        else{ //if there are no pins the array, return an empty string. 
            return "";
        }
    }

    const [curGoalInfo, setCurGoalInfo] = useState(getCurrentPinInfo("pinGoal"));
    const [curStrengthInfo, setCurStrengthInfo] = useState(getCurrentPinInfo("pinStrength"));
    const [curOpporunityInfo, setCurOpportunityInfo] = useState(getCurrentPinInfo("pinOpportunity"));

    useEffect(() => {
        if (pins.length > 0){
            fetchCurTextVal();
            pins[prevPinIndex].pinGoal = curGoalInfo;
            pins[prevPinIndex].pinStrength = curStrengthInfo;
            pins[prevPinIndex].pinOpportunity = curOpporunityInfo;
            setCurGoalInfo(pins[curPinIndex].pinGoal);
            setCurStrengthInfo(pins[curPinIndex].pinStrength);
            setCurOpportunityInfo(pins[curPinIndex].pinOpportunity);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }, [curPinIndex, curGoalInfo, curOpporunityInfo, curStrengthInfo, pins, prevPinIndex])//curPinIndex shouldn't change if there are not pins. 


    // for updating and fetching current text field value
    const fetchCurTextVal = async (infoName) => {
        let curPin = pins[curPinIndex];

        if (user.userMode === "caller")
            setCurNoteInfo(curPin.callerPinNote);
        else
            setCurNoteInfo(curPin.calleePinNote);

        setCurPerspectiveInfo1(curPin.callerPinPerspective);
        setCurPerspectiveInfo2(curPin.calleePinPerspective);

        setPinType1(curPin.callerPinCategory);
        setPinType2(curPin.calleePinCategory);

        setCurSkillInfo1(curPin.callerPinSkill);
        setCurSkillInfo2(curPin.calleePinSkill);
    }

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
    return <Fragment> {prev} {next} </Fragment>;
    }

    return (
        <Grid item xs={12} sm={8}>
            {curPinIndex !== -1 ?
            <ColorLibPaper elevation={1}>
                {/* <Typography variant="h4" style={{ textTransform: 'capitalize' }}>
                    {userMode}
                </Typography> */}
                {curPinIndex !== -1 ?
                    <Box fontStyle="italic">
                        <Typography>
                            The session was pinned at {formatTime(pins.map(pin => pin.pinTime)[curPinIndex])} by {pins[curPinIndex].creatorMode === user.userMode ? "you" : "your peer"}
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
                    <Typography>
                        What was the goal during the pinned situation?
                    </Typography>
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
                    <Typography>
                        What worked well to achieve the goal?
                    </Typography>
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
                    <Typography>
                        What could be improved to achieve the goal?
                    </Typography>
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

                <Box textAlign='center'>
                    <PinNavButtons />
                </Box>
            </ColorLibPaper>
            : 
            <Box fontStyle="italic">
                <Typography>
                {"\n"}No pins to see. Try adding some!!!{"\n\n"}
                </Typography>
            </Box>
            }
        </Grid>
    );
};

export default DissResponse;