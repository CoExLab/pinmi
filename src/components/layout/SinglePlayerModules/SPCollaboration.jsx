import React, { Fragment, useState } from "react";
// Components
import DissResponse from "../../DissResponse";
import AudioReview from "../../AudioReview";
import Transcription from "../../Transcription";
import VideoDiscussion from "../../VideoDiscussion.js";
// Others
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Grid } from "@material-ui/core";
import ColorLibButton, {
  ColorLibBackButton,
  ColorLibNextButton,
} from "../ColorLibComponents/ColorLibButton";
import VideoChatComponent from "../../VideoChatComponent";
import {
  useSessionValue,
  useActiveStepValue,
  usePinsValue,
} from "../../../context";
import { baseURL } from "constants";
import SinglePlayerNotesComparison from "../SinglePlayerComponents/SinglePlayerNotesComparison";
import SinglePlayerComment from "../SinglePlayerComponents/SinglePlayerComment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.paper",
  },
  imageIcon: {
    height: "100%",
  },
  iconRoot: {
    textAlign: "center",
  },
  fab: {
    marginLeft: 450,
    marginRight: 200,
  },
  grid: {
    "& .MuiGrid-item": {
      display: "inline-grid",
    },
    "& .MuiGrid-grid-sm-4": {
      position: "relative",
      margin: "8px",
      maxWidth: "calc(33.333333% - 8px)",
      "& .MuiPaper-root": {
        position: "absolute",
        top: 0,
        bottom: 0,
        overflowY: "scroll",
      },
    },
    "& .MuiGrid-grid-sm-8": {
      maxWidth: "calc(66.666667% - 8px)",
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

  const { pins } = usePinsValue();

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
        style={{ margin: "0px 8px" }}
        variant="contained"
        size="small"
        onClick={handlePrevPin}
      >
        Prev Pin
      </ColorLibBackButton>
    );
    const next = (
      <ColorLibNextButton
        style={{ margin: "0px 8px" }}
        variant="contained"
        size="small"
        onClick={handleNextPin}
      >
        Next Pin
      </ColorLibNextButton>
    );

    if (curPinIndex === 0) {
      return next;
    }
    if (curPinIndex === pins.length - 1) {
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
      <Container maxWidth="md">
        <Grid container spacing={2} className={classes.grid}>
          <AudioReview
            curPinIndex={curPinIndex}
            setCurPinIndex={setCurPinIndex}
            prevPinIndex={prevPinIndex}
            setPrevPinIndex={setPrevPinIndex}
          />
          <Grid item xs={12}>
            <Box align="center" m={2} mb={5}>
              <PinNavButtons />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <Grid container spacing={2} className={classes.grid}>
          <Transcription />
          <Grid item xs={8}>
            <SinglePlayerComment />
            <Grid container spacing={2} className={classes.grid}>
              <SinglePlayerNotesComparison
                curPinIndex={curPinIndex}
                setCurPinIndex={setCurPinIndex}
                prevPinIndex={prevPinIndex}
                setPrevPinIndex={setPrevPinIndex}
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
