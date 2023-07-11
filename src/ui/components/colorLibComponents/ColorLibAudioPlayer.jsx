import { withStyles } from '@material-ui/core/styles';
import { Grid, Icon, IconButton, Paper, Slider, Typography } from '@material-ui/core';

import Forward10Icon from '@material-ui/icons/Forward10';
import Replay10Icon from '@material-ui/icons/Replay10';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { useSelector } from 'react-redux';

import pin from '../../../other/images/pin.svg';

const color = {
  default: '#80cbc4',
  you: '#92BFB1',
  peer: '#F4AC45',
};
const displayTime = secs => {
  let minutes = Math.floor(secs / 60);
  let seconds = Math.floor(secs % 60);

  // Convert to 2-digit string
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutes}:${seconds}`;
};

const getIconByPlayerStatus = (playerStatus, setPlayerStatus) => {
  const PlayerIconButton = withStyles(theme => ({
    root: {
      color: theme.palette.teal.main,
      // color: 'black',
      padding: '0px',
    },
    label: {
      '& .MuiSvgIcon-root': {
        width: '80px',
        height: '80px',
      },
    },
  }))(IconButton);

  return (
    <PlayerIconButton onClick={() => setPlayerStatus(!playerStatus)}>
      {playerStatus ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
    </PlayerIconButton>
  );
};

const AudioSlider = withStyles(theme => ({
  marked: {
    marginBottom: '0px',
  },
  thumb: {
    borderRadius: '0',
    color: 'black',
    height: '48px',
    marginTop: '-23px',
    marginLeft: '-2px',
    width: '4px',
    boxShadow: 'none !important',
    '&::after': {
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
    },
  },
  root: {
    height: '6px',
  },
  rail: {
    height: '6px',
    color: theme.palette.teal.light,
    opacity: '100%',
  },
  track: {
    height: '6px',
    color: theme.palette.teal.main,
    borderRadius: '6px',
  },
  // mark: {
  //   height: '14px',
  //   width: '14px',
  //   borderRadius: '14px',
  //   // backgroundColor: theme.palette.pink.main,
  //   marginTop: '-4px',
  //   marginLeft: '-4px',
  //   // zIndex: 1,
  // },
  // markActive: {
  //   opacity: 1,
  //   // backgroundColor: theme.palette.pink.dark,
  // },
  markLabel: {
    top: 'inherit',
    transform: 'none',
    height: '6px',
    width: '100%',
    borderRadius: '6px',
    // left: '0 !important',
    opacity: 1,
    lineHeight: '30px',
  },
}))(Slider);

const ColorLibAudioPlayer = ({
  playerStatus,
  setPlayerStatus,
  currentTime,
  setCurrentTime, // set current pin index
  duration,
  marks, // List of integers, each in seconds
  addPin = null,
  recordOnlyMode,
}) => {
  const user = useSelector(state => state.user);
  const jumpPercentage = (10 / duration) * 100;

  const JumpIconButton = withStyles(theme => ({
    root: {
      color: theme.palette.teal.main,
      padding: '10px',
    },
    label: {
      '& .MuiSvgIcon-root': {
        width: '40px',
        height: '40px',
      },
    },
  }))(IconButton);

  const PinIconButton = withStyles(theme => ({
    root: {
      padding: '15px',
      boxShadow: '0px 6px 8px rgba(51, 126, 146, 0.25)',
      border: '1.5px solid',
      borderColor: theme.palette.teal.lighter,
    },
    label: {
      '& .MuiIcon-root': {
        width: '27px',
        height: '27px',
      },
    },
  }))(IconButton);

  // Before creating mark information for pins, check there are no duplicates.
  marks = [...new Set(marks)];
  const pinMarks = marks.map((m, index) => {
    // if (index === 0) return {};
    // console.log(m);
    const markTime = m.markTime;
    const creatorMode = m.creatorMode;

    const centerPercentage = (markTime / duration) * 100;
    const tenSecPercentage = (10 / duration) * 100;
    const leftPercentage = ((markTime - 10) / duration) * 100;
    const widthPercentage = Math.min(100 - leftPercentage, 2 * jumpPercentage);
    const left = leftPercentage < 0 ? centerPercentage * -1 : tenSecPercentage * -1;
    const leftNewWidth = leftPercentage < 0 ? centerPercentage : tenSecPercentage;
    const rightNewWidth =
      centerPercentage + tenSecPercentage > 100
        ? leftNewWidth + (100 - centerPercentage)
        : leftNewWidth + tenSecPercentage;

    return {
      value: markTime,
      label: (
        <>
          <div
            style={{
              height: '20px',
              width: '20px',
              borderRadius: '20px',
              // backgroundColor: creatorMode == 'callee' ? '#FC6D78' : '#337193',
              backgroundColor:
                color[creatorMode == 'default' ? 'default' : creatorMode == user.userMode ? 'you' : 'peer'],
              marginTop: '-8px',
              marginLeft: '-2px',
              position: 'relative',
              zIndex: 10,
              display: creatorMode == 'default' ? 'none' : 'flex',
            }}
          />
          {/* <div
            style={{
              height: '6px',
              position: 'relative',
              left: `calc(${left}%)`,
              width: `${rightNewWidth}%`,
              borderRadius: '6px',
              backgroundColor: '#FDA2A9',
              marginTop: '-10px',
              zIndex: 1,
            }}
          /> */}

          <div
            style={{
              marginRight: `calc(${leftPercentage}% + 3px)`,
              width: `calc(${widthPercentage}%)`,
              // color: creatorMode == 'callee' ? '#FC6D78' : '#337193',
              color: color[creatorMode == 'default' ? 'default' : creatorMode == user.userMode ? 'you' : 'peer'],
              fontSize: '22px',
              display: creatorMode == 'default' ? 'none' : 'flex',
            }}
          >
            {index + 1}
          </div>
        </>
      ),
    };
  });

  return (
    <Paper variant="outlined" style={{ padding: '10px 10px 20px 10px', marginTop: 10 }}>
      <Grid container>
        <Grid item xs={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
          {getIconByPlayerStatus(playerStatus, setPlayerStatus)}
        </Grid>

        <Grid item xs={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2">{displayTime(currentTime)}</Typography>
        </Grid>

        <Grid item xs={9} style={{ alignItems: 'center' }}>
          <AudioSlider
            value={currentTime}
            onChange={(event, newValue) => {
              setCurrentTime(newValue);
            }}
            max={duration}
            step={1}
            marks={pinMarks}
          />
        </Grid>

        <Grid item xs={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2">{displayTime(duration)}</Typography>
        </Grid>
      </Grid>

      {/* <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-15px',
        }}
      >
        <JumpIconButton onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
          <Replay10Icon />
        </JumpIconButton>
        {recordOnlyMode !== true && (
          <PinIconButton onClick={() => addPin(currentTime)}>
            <Icon>
              <img src={pin} alt="pin" style={{ height: '100%' }} />
            </Icon>
          </PinIconButton>
        )}

        <JumpIconButton onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
          <Forward10Icon />
        </JumpIconButton>
      </div> */}
    </Paper>
  );
};

export default ColorLibAudioPlayer;
