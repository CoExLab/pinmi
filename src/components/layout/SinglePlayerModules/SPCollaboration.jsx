import React, { Fragment, useEffect, useState } from 'react';
// Components
import DissResponse from '../../DissResponse';
import AudioReview from '../../AudioReview';
import Transcription from '../../Transcription';
import VideoDiscussion from '../../VideoDiscussion.js';
// Others
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Grid } from '@material-ui/core';
import ColorLibButton, {
  ColorLibBackButton,
  ColorLibNextButton,
} from '../ColorLibComponents/ColorLibButton';
import VideoChatComponent from '../../VideoChatComponent';
import {
  useSessionValue,
  useActiveStepValue,
  usePinsValue,
  useSinglePlayerSessionValue,
  useSinglePlayerPinsValue,
} from '../../../context';
import { baseURL } from 'constants';
import SinglePlayerNotesComparison from '../SinglePlayerComponents/SinglePlayerNotesComparison';
import SinglePlayerComment from '../SinglePlayerComponents/SinglePlayerComment';
import SinglePlayerTranscript from '../SinglePlayerComponents/SinglePlayerTranscript';
import SinglePlayerAudioReview from '../SinglePlayerComponents/SinglePlayerAudioReview';
import { firebase } from '../../../hooks/firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'theme.palette.background.paper',
    height: '50%',
  },
  imageIcon: {
    height: '100%',
  },
  iconRoot: {
    textAlign: 'center',
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  },
  grid: {
    '& .MuiGrid-item': {
      display: 'inline-grid',
      overflowY: 'scroll',
    },
    '& .MuiGrid-grid-sm-4': {
      position: 'relative',
      margin: '8px',
      maxWidth: 'calc(33.333333% - 8px)',
      '& .MuiPaper-root': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        overflowY: 'scroll',
      },
    },
    '& .MuiGrid-grid-sm-8': {
      maxWidth: 'calc(66.666667% - 8px)',
    },
    '& .MuiGrid-root': {
      //   "& ::-webkit-scrollbar": {
      //     width: "12px",
      //   },
      //   "& ::-webkit-scrollbar-track": {
      //     background: "orange",
      //   },
      //   "& ::-webkit-scrollbar-thumb": {
      //     backgroundColor: "blue",
      //     borderRadius: "20px",
      //     border: "3px solid orange",
      //   },
    },
    '& .MuiGrid-container': {
      height: '50%',
    },
  },
}));

const SPCollaboration = ({
  curPinIndex,
  setCurPinIndex,
  prevPinIndex,
  setPrevPinIndex,
}) => {
  const classes = useStyles();
  const { curActiveStep: activeStep, setCurActiveStep: setActiveStep } =
    useActiveStepValue();
  const { singlePlayerUsername, singlePlayerSessionID } =
    useSinglePlayerSessionValue();
  const { singlePlayerPins } = useSinglePlayerPinsValue();
  const [peerPins, setPeerPins] = useState([]);

  useEffect(() => {
    addPeerPins();
  }, []);

  const binarySearch = (arr, l, r, x) => {
    if (r >= l) {
      let mid = l + Math.floor((r - l) / 2);

      // If the element is present at the middle
      // itself
      if (
        arr[mid] == x ||
        mid + 1 >= arr.length ||
        (arr[mid] <= x && arr[mid + 1] > x)
      )
        return mid;

      // If element is smaller than mid, then
      // it can only be present in left subarray
      if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);

      // Else the element can only be present
      // in right subarray
      return binarySearch(arr, mid + 1, r, x);
    }
    // We reach here when element is not
    // present in array
    return -1;
  };

  const getTimeStamp = (transcriptArr) => {
    return (
      transcriptArr &&
      transcriptArr.map((transcriptString) => {
        var index = transcriptString.indexOf('-');
        if (index) {
          var tempTimeSeconds = Math.floor(
            parseInt(transcriptString.slice(0, index), 10) / 1000
          );

          return tempTimeSeconds;
        }
      })
    );
  };

  const addPeerPins = async () => {
    // const docRef = await firebase
    //   .firestore()
    //   .collection("singleplayer_media")
    //   .doc(singlePlayerSessionID);
    const docRef = await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(singlePlayerUsername)
      .collection('sessions')
      .doc(singlePlayerSessionID);

    let transcript = [];
    docRef.get().then((doc) => {
      console.log(doc.data().calleeTranscript);
      transcript = getTimeStamp(doc.data().calleeTranscript);
    });

    docRef
      .collection('pins')
      .get()
      .then((doc) => {
        doc.forEach((d) => {
          const TSIndex = binarySearch(
            transcript,
            0,
            transcript.length,
            d.data().pinTime
          );
          peerPins.push({ ...d.data(), transcriptindex: TSIndex });
        });
      });
  };
  // const [room, setRoom] = useState("hello");
  //   //const [baseURL, setBaseURL] = useState('https://pinmi-test.herokuapp.com/room/' + room);
  //   const [apiKey, setApiKey] = useState("YOUR_API_KEY");
  //   const [sessionId, setSessionId] = useState("YOUR_SESSION_ID");
  //   const [token, setToken] = useState("YOUR_TOKEN");
  //   const [readyMessage, setReadyMessage] = useState("video is not ready");
  //   const isRecording = false;

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
        {prev}
        {next}
      </Fragment>
    );
  };

  return (
    <div className={classes.root}>
      <Container maxWidth='md'>
        <Grid container spacing={2} className={classes.grid}>
          <SinglePlayerAudioReview
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
            disableAddPin
          />
          <Grid item xs={12}>
            <Box align='center' m={2} mb={5}>
              <PinNavButtons />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth='lg' className={classes.container}>
        <Grid container spacing={2} className={classes.grid}>
          <SinglePlayerTranscript
            selectedIndex={
              singlePlayerPins[curPinIndex] &&
              singlePlayerPins[curPinIndex].transcriptindex
            }
          />
          <Grid item xs={8} className={classes.grid}>
            <Grid
              container
              spacing={2}
              style={{ height: '80vh', overflow: 'scroll' }}
            >
              <SinglePlayerNotesComparison
                curPinIndex={curPinIndex}
                setCurPinIndex={setCurPinIndex}
                prevPinIndex={prevPinIndex}
                setPrevPinIndex={setPrevPinIndex}
                peerPins={peerPins}
              />
            </Grid>
          </Grid>

          {/* <VideoDiscussion mode = {"Discussion"} discussionState = {1}/> */}
        </Grid>
      </Container>
    </div>
  );
};

export default SPCollaboration;
