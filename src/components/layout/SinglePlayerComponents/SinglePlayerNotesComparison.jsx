import React, { useState, useRef, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { formatTime } from '../../../helper/index';
import { Box, Grid, Paper, Typography, Container } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import {
  ColorLibNextButton,
  ColorLibBackButton,
} from '../../layout/ColorLibComponents/ColorLibButton';
import ColorLibPaper from '../../layout/ColorLibComponents/ColorLibPaper';
import ColorLibTextField from '../../layout/ColorLibComponents/ColorLibTextField';
import MISkillsSheet from '../../layout/MISkillsSheet';

// firebase hook
import { usePins } from '../../../hooks/index';
import { firebase } from '../../../hooks/firebase';

//context
import { useSessionValue, useSinglePlayerPinsValue } from '../../../context';
import { useSelector } from 'react-redux';

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
      },
    },
  },
  grid: {
    '& .MuiGrid-item': {
      display: 'inline-grid',
    },
    '& .MuiGrid-grid-sm-4': {
      position: 'relative',
      margin: '8px',
      maxWidth: 'calc(33.333333% - 8px)',
    },
    '& .MuiGrid-grid-sm-8': {
      maxWidth: 'calc(66.666667% - 8px)',
    },
  },
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
      },
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
    },
  },
}));

const SinglePlayerNotesComparison = ({
  curPinIndex,
  setCurPinIndex,
  prevPinIndex,
  setPrevPinIndex,
  peerPins,
}) => {
  // user mode switcher
  const user = useSelector((state) => state.user);

  const classes = useStyles();

  //creating a refernce for TextField Components
  const efficacyValueRef = useRef('');
  const goalValueRef = useRef('');
  const strengthValueRef = useRef('');
  const opportunityValueRef = useRef('');

  //get sessionID
  const { sessionID } = useSessionValue();

  const { singlePlayerPins } = useSinglePlayerPinsValue();
  const [peerPin, setPeerPin] = useState();

  // // fetch raw pin data here
  // const [pins, setPins] = useState([
  //   {
  //     calleePinCategory: "category",
  //     calleePinNote:
  //       "client acknowledged that she’s thought about quitting but it’s difficult.",
  //     calleePinPerspective: "perspective",
  //     calleePinSkill: "skills",
  //     pinEfficacy: "",
  //     pinGoal: "goal",
  //     pinID: "id num",
  //     pinOpportunity: "opp",
  //     pinStrength: "strength",
  //   },
  // ]);

  // set up states for four different questions
  const [curNoteInfo, setCurNoteInfo] = useState('');
  const [peerNoteInfo, setPeerNoteInfo] = useState('');

  const [curPerspectiveInfo1, setCurPerspectiveInfo1] = useState('');
  const [curPerspectiveInfo2, setCurPerspectiveInfo2] = useState('');

  const [pinType1, setPinType1] = useState('Strength');
  const [pinType2, setPinType2] = useState('');

  const [curSkillInfo1, setCurSkillInfo1] = useState('');
  const [curSkillInfo2, setCurSkillInfo2] = useState('');

  const [curGoalInfo, setCurGoalInfo] = useState(
    singlePlayerPins[curPinIndex].pinGoal
  );
  const [peerGoalInfo, setPeerGoalInfo] = useState(
    singlePlayerPins[curPinIndex].pinGoal
  );

  const [curStrengthInfo, setCurStrengthInfo] = useState(
    singlePlayerPins[curPinIndex].pinStrength
  );
  const [peerStrengthInfo, setPeerStrengthInfo] = useState(
    singlePlayerPins[curPinIndex].pinStrength
  );

  const [curOpporunityInfo, setCurOpportunityInfo] = useState(
    singlePlayerPins[curPinIndex].pinOpportunity
  );
  const [peerOpporunityInfo, setPeerOpportunityInfo] = useState(
    singlePlayerPins[curPinIndex].pinOpportunity
  );

  useEffect(() => {
    fetchCurTextVal();
    fetchPeerPins();
    singlePlayerPins[prevPinIndex].pinGoal = curGoalInfo;
    singlePlayerPins[prevPinIndex].pinStrength = curStrengthInfo;
    singlePlayerPins[prevPinIndex].pinOpportunity = curOpporunityInfo;
    setCurGoalInfo(singlePlayerPins[curPinIndex].pinGoal);
    setCurStrengthInfo(singlePlayerPins[curPinIndex].pinStrength);
    setCurOpportunityInfo(singlePlayerPins[curPinIndex].pinOpportunity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPinIndex]);

  const fetchPeerPins = async () => {
    let curPin = singlePlayerPins[curPinIndex];
    console.log(curPin);
    let TSIndex = curPin.transcriptindex;

    let peerPin = peerPins.find((e) => e.transcriptindex == TSIndex);
    setPeerPin(peerPin);
    console.log('CUR PINS TS: ', TSIndex);

    if (!peerPin) {
      console.log('No peer pin matched');
    } else {
      setCurPerspectiveInfo2(peerPin['calleePinPerspective']);
      setPinType2(peerPin['calleePinCategory']);
      setCurSkillInfo2(peerPin['calleePinSkill']);
      setPeerNoteInfo(peerPin['calleePinNote']);
      setPeerGoalInfo(peerPin['pinGoal']);
      setPeerStrengthInfo(peerPin['pinStrength']);
      setPeerOpportunityInfo(peerPin['pinOpportunity']);
      console.log('Peer PINS TS: ', peerPin.transcriptindex);
    }
  };

  // for updating and fetching current text field value
  const fetchCurTextVal = async (infoName) => {
    let curPin = singlePlayerPins[curPinIndex];

    if (user.userMode === 'caller') setCurNoteInfo(curPin.callerPinNote);
    else setCurNoteInfo(curPin.calleePinNote);

    setCurPerspectiveInfo1(curPin.calleePinPerspective);
    setPinType1(curPin.calleePinCategory);
    setCurSkillInfo1(curPin.calleePinSkill);
  };

  const handlePrevPin = () => {
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(curPinIndex - 1);
  };

  const handleNextPin = () => {
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(curPinIndex + 1);
  };

  const PinNavButtons = () => {
    if (curPinIndex === -1) return null;
    const prev = (
      <ColorLibBackButton
        style={{ margin: '0px 8px' }}
        variant='contained'
        size='small'
        onClick={handlePrevPin}
      >
        Prev Pin
      </ColorLibBackButton>
    );
    const next = (
      <ColorLibNextButton
        style={{ margin: '0px 8px' }}
        variant='contained'
        size='small'
        onClick={handleNextPin}
      >
        Next Pin
      </ColorLibNextButton>
    );

    if (curPinIndex === 0) {
      return next;
    }
    if (curPinIndex === singlePlayerPins.length - 1) {
      return prev;
    }
    return (
      <Fragment>
        {' '}
        {prev} {next}{' '}
      </Fragment>
    );
  };

  return (
    <>
      <Grid item xs className={classes.grid}>
        <ColorLibPaper elevation={2}>
          <Typography variant='h4' style={{ textTransform: 'capitalize' }}>
            Your Pin Notes
          </Typography>
          {curPinIndex !== -1 ? (
            <Box fontStyle='italic'>
              <Typography>
                The session was pinned at{' '}
                {formatTime(
                  singlePlayerPins.map((pin) => pin.pinTime)[curPinIndex]
                )}
              </Typography>
            </Box>
          ) : null}
          <ColorLibTextField
            disabled
            id='outlined-secondary'
            label='Personal Notes...'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            margin='normal'
            value={curNoteInfo}
          />
          <Box textAlign='left'>
            <Typography>
              What is your perspective of what happened at this pin?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=''
            id='outlined-secondary'
            fullWidth
            variant='outlined'
            multiline
            rows={2}
            margin='normal'
            value={curPerspectiveInfo1}
          />
          <Box textAlign='left'>
            <Typography>What would you categorize this pin as?</Typography>
          </Box>

          <Box align='left'>
            <ToggleButtonGroup
              disabled
              className={classes.toggleGroup}
              value={pinType1}
              exclusive
              size='large'
            >
              <ToggleButton value='strength' selected={pinType1 === 'strength'}>
                Strength
              </ToggleButton>
              <ToggleButton
                value='opportunity'
                selected={pinType1 === 'opportunity'}
              >
                Opportunity
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box textAlign='left'>
            <Typography>
              What was the goal during the pinned situation?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=''
            id='outlined-secondary'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            margin='normal'
            value={curGoalInfo}
            inputRef={goalValueRef}
            onChange={() => setCurGoalInfo(goalValueRef.current.value)}
          />

          <Box textAlign='left'>
            <Typography>What worked well to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=''
            id='outlined-secondary'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            margin='normal'
            value={curStrengthInfo}
            inputRef={strengthValueRef}
            onChange={() => setCurStrengthInfo(strengthValueRef.current.value)}
          />
          <Box textAlign='left'>
            <Typography>What could be improved to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=''
            id='outlined-secondary'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            margin='normal'
            value={curOpporunityInfo}
            inputRef={opportunityValueRef}
            onChange={() =>
              setCurOpportunityInfo(opportunityValueRef.current.value)
            }
          />
        </ColorLibPaper>
      </Grid>
      <Grid item xs>
        <ColorLibPaper elevation={1}>
          <Typography variant='h4' style={{ textTransform: 'capitalize' }}>
            Peer's Pin Notes
          </Typography>
          {peerPin ? (
            <>
              <Box fontStyle='italic'>
                <Typography>
                  The session was pinned at {formatTime(peerPin.pinTime)}
                </Typography>
              </Box>
              <ColorLibTextField
                disabled
                id='outlined-secondary'
                label='Personal Notes...'
                fullWidth
                variant='outlined'
                multiline
                rows={3}
                margin='normal'
                value={peerNoteInfo}
              />
              <Box textAlign='left'>
                <Typography>
                  What is your perspective of what happened at this pin?
                </Typography>
              </Box>
              <ColorLibTextField
                disabled
                label=''
                id='outlined-secondary'
                fullWidth
                variant='outlined'
                multiline
                rows={2}
                margin='normal'
                value={curPerspectiveInfo2}
              />
              <Box textAlign='left'>
                <Typography>What would you categorize this pin as?</Typography>
              </Box>
              <Box align='left'>
                <ToggleButtonGroup
                  disabled
                  className={classes.toggleGroup}
                  value={pinType2}
                  exclusive
                  size='large'
                >
                  <ToggleButton
                    value='strength'
                    selected={pinType2 === 'strength'}
                  >
                    Strength
                  </ToggleButton>
                  <ToggleButton
                    value='opportunity'
                    selected={pinType2 === 'opportunity'}
                  >
                    Opportunity
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <MISkillsSheet />

              <Box textAlign='left'>
                <Typography>
                  What was the goal during the pinned situation?
                </Typography>
              </Box>
              <ColorLibTextField
                disabled
                label=''
                id='outlined-secondary'
                fullWidth
                variant='outlined'
                multiline
                rows={3}
                margin='normal'
                value={peerGoalInfo}
                inputRef={goalValueRef}
                onChange={() => setCurGoalInfo(goalValueRef.current.value)}
              />
              <Box textAlign='left'>
                <Typography>What worked well to achieve the goal?</Typography>
              </Box>
              <ColorLibTextField
                disabled
                label=''
                id='outlined-secondary'
                fullWidth
                variant='outlined'
                multiline
                rows={3}
                margin='normal'
                value={peerStrengthInfo}
                inputRef={strengthValueRef}
                onChange={() =>
                  setCurStrengthInfo(strengthValueRef.current.value)
                }
              />
              <Box textAlign='left'>
                <Typography>
                  What could be improved to achieve the goal?
                </Typography>
              </Box>
              <ColorLibTextField
                disabled
                label=''
                id='outlined-secondary'
                fullWidth
                variant='outlined'
                multiline
                rows={3}
                margin='normal'
                value={peerOpporunityInfo}
                inputRef={opportunityValueRef}
                onChange={() =>
                  setCurOpportunityInfo(opportunityValueRef.current.value)
                }
              />
            </>
          ) : (
            <Box fontStyle='italic'>
              <Typography style={{ color: '#FC6D78' }}>
                Your peer did not pin here.
              </Typography>
            </Box>
          )}
        </ColorLibPaper>
      </Grid>
    </>
  );
};

export default SinglePlayerNotesComparison;
