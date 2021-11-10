import React, { useState, useRef, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatTime } from "../../../helper/index";
import { Box, Grid, Paper, Typography, Container } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import {
  ColorLibNextButton,
  ColorLibBackButton,
} from "../../layout/ColorLibComponents/ColorLibButton";
import ColorLibPaper from "../../layout/ColorLibComponents/ColorLibPaper";
import ColorLibTextField from "../../layout/ColorLibComponents/ColorLibTextField";
import MISkillsSheet from "../../layout/MISkillsSheet";

// firebase hook
import { usePins } from "../../../hooks/index";
import { firebase } from "../../../hooks/firebase";

//context
import {
  useSessionValue,
  useUserModeValue,
  usePinsValue,
  PinsProvider,
} from "../../../context";
import { format } from "url";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      width: "100%",
      "&:first-child": {
        marginRight: "8px",
      },
      "&:last-child": {
        marginLeft: "8px",
      },
    },
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

const SinglePlayerNotesComparison = ({
  curPinIndex,
  setCurPinIndex,
  prevPinIndex,
  setPrevPinIndex,
}) => {
  // user mode switcher
  const { userMode } = useUserModeValue();

  const classes = useStyles();

  //creating a refernce for TextField Components
  const efficacyValueRef = useRef("");
  const goalValueRef = useRef("");
  const strengthValueRef = useRef("");
  const opportunityValueRef = useRef("");

  //get sessionID
  const { sessionID } = useSessionValue();

  const { pins } = usePinsValue();

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
  const [curNoteInfo, setCurNoteInfo] = useState("");
  const [peerNoteInfo, setPeerNoteInfo] = useState("");

  const [curPerspectiveInfo1, setCurPerspectiveInfo1] = useState("");
  const [curPerspectiveInfo2, setCurPerspectiveInfo2] = useState("");

  const [pinType1, setPinType1] = useState("Strength");
  const [pinType2, setPinType2] = useState("");

  const [curSkillInfo1, setCurSkillInfo1] = useState("");
  const [curSkillInfo2, setCurSkillInfo2] = useState("");

  const [curEfficacyInfo, setCurEfficacyInfo] = useState(
    pins[curPinIndex].pinEfficacy
  );
  const [peerEfficacyInfo, setPeerEfficacyInfo] = useState(
    pins[curPinIndex].pinEfficacy
  );

  const [curGoalInfo, setCurGoalInfo] = useState(pins[curPinIndex].pinGoal);
  const [peerGoalInfo, setPeerGoalInfo] = useState(pins[curPinIndex].pinGoal);

  const [curStrengthInfo, setCurStrengthInfo] = useState(
    pins[curPinIndex].pinStrength
  );
  const [peerStrengthInfo, setPeerStrengthInfo] = useState(
    pins[curPinIndex].pinStrength
  );

  const [curOpporunityInfo, setCurOpportunityInfo] = useState(
    pins[curPinIndex].pinOpportunity
  );
  const [peerOpporunityInfo, setPeerOpportunityInfo] = useState(
    pins[curPinIndex].pinOpportunity
  );

  useEffect(() => {
    fetchCurTextVal();
    fetchPeerPins();
    pins[prevPinIndex].pinEfficacy = curEfficacyInfo;
    pins[prevPinIndex].pinGoal = curGoalInfo;
    pins[prevPinIndex].pinStrength = curStrengthInfo;
    pins[prevPinIndex].pinOpportunity = curOpporunityInfo;
    setCurEfficacyInfo(pins[curPinIndex].pinEfficacy);
    setCurGoalInfo(pins[curPinIndex].pinGoal);
    setCurStrengthInfo(pins[curPinIndex].pinStrength);
    setCurOpportunityInfo(pins[curPinIndex].pinOpportunity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPinIndex]);

  const fetchPeerPins = async () => {
    const docRef = firebase
      .firestore()
      .collection("singleplayer")
      .doc("elcHhttJlKQfaFlkGkYv")
      .collection("session_pins")
      .doc("user1");
    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurPerspectiveInfo2(doc.data()["calleePinPerspective"]);
          setPinType2(doc.data()["calleePinCategory"]);
          setCurSkillInfo2(doc.data()["calleePinSkill"]);
          setPeerNoteInfo(doc.data()["calleePinNote"]);
          setPeerEfficacyInfo(doc.data()["pinEfficacy"]);
          setPeerGoalInfo(doc.data()["pinGoal"]);
          setPeerStrengthInfo(doc.data()["pinStrength"]);
          setPeerOpportunityInfo(doc.data()["pinOpportunity"]);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  // for updating and fetching current text field value
  const fetchCurTextVal = async (infoName) => {
    let curPin = pins[curPinIndex];

    if (userMode === "caller") setCurNoteInfo(curPin.callerPinNote);
    else setCurNoteInfo(curPin.calleePinNote);

    setCurPerspectiveInfo1(curPin.callerPinPerspective);
    setPinType1(curPin.callerPinCategory);
    setCurSkillInfo1(curPin.callerPinSkill);
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
        {" "}
        {prev} {next}{" "}
      </Fragment>
    );
  };

  return (
    <>
      <Grid item xs>
        <ColorLibPaper elevation={2}>
          <Typography variant="h4" style={{ textTransform: "capitalize" }}>
            {userMode}
          </Typography>
          {curPinIndex !== -1 ? (
            <Box fontStyle="italic">
              <Typography>
                The session was pinned at{" "}
                {formatTime(pins.map((pin) => pin.pinTime)[curPinIndex])}
              </Typography>
            </Box>
          ) : null}
          <ColorLibTextField
            disabled
            label=""
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
            <Typography variant="h3">Talk with your peer about:</Typography>
          </Box>

          <Box textAlign="left">
            <Typography>
              What is your perspective of what happened at this pin?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            label="caller's perspective"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            margin="normal"
            value={curPerspectiveInfo1}
          />
          <Box textAlign="left">
            <Typography>What would you categorize this pin as?</Typography>
          </Box>
          <Box align="left">
            <ToggleButtonGroup
              disabled
              className={classes.toggleGroup}
              exclusive
              size="large"
            >
              <ToggleButton>{pinType1}</ToggleButton>
              <ToggleButton>{pinType2}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <MISkillsSheet />
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            margin="normal"
            value={curSkillInfo1}
          />
          <Box textAlign="left">
            <Typography>
              Why was the pinned situation effective or ineffective?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={curEfficacyInfo}
            inputRef={efficacyValueRef}
            onChange={() => setCurEfficacyInfo(efficacyValueRef.current.value)}
          />

          <Box textAlign="left">
            <Typography>
              What was the goal during the pinned situation?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
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
            <Typography>What worked well to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            id="outlined-secondary"
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
            <Typography>What could be improved to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
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
          <Typography variant="h4" style={{ textTransform: "capitalize" }}>
            {userMode}
          </Typography>
          {curPinIndex !== -1 ? (
            <Box fontStyle="italic">
              <Typography>
                The session was pinned at{" "}
                {formatTime(pins.map((pin) => pin.pinTime)[curPinIndex])}
              </Typography>
            </Box>
          ) : null}
          <ColorLibTextField
            disabled
            id="outlined-secondary"
            label="Personal Notes..."
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={peerNoteInfo}
          />
          <Box fontStyle="italic" marginTop="16px">
            <Typography variant="h3">Talk with your peer about:</Typography>
          </Box>

          <Box textAlign="left">
            <Typography>
              What is your perspective of what happened at this pin?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            margin="normal"
            value={curPerspectiveInfo2}
          />
          <Box textAlign="left">
            <Typography>What would you categorize this pin as?</Typography>
          </Box>
          <Box align="left">
            <ToggleButtonGroup
              disabled
              className={classes.toggleGroup}
              exclusive
              size="large"
            >
              <ToggleButton>{pinType1}</ToggleButton>
              <ToggleButton>{pinType2}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <MISkillsSheet />
          <form className={classes.root} noValidate autoComplete="off">
            <ColorLibTextField
              disabled
              label=""
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
              Why was the pinned situation effective or ineffective?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={peerEfficacyInfo}
            inputRef={efficacyValueRef}
            onChange={() => setCurEfficacyInfo(efficacyValueRef.current.value)}
          />

          <Box textAlign="left">
            <Typography>
              What was the goal during the pinned situation?
            </Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={peerGoalInfo}
            inputRef={goalValueRef}
            onChange={() => setCurGoalInfo(goalValueRef.current.value)}
          />
          <Box textAlign="left">
            <Typography>What worked well to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={peerStrengthInfo}
            inputRef={strengthValueRef}
            onChange={() => setCurStrengthInfo(strengthValueRef.current.value)}
          />
          <Box textAlign="left">
            <Typography>What could be improved to achieve the goal?</Typography>
          </Box>
          <ColorLibTextField
            disabled
            label=""
            id="outlined-secondary"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={peerOpporunityInfo}
            inputRef={opportunityValueRef}
            onChange={() =>
              setCurOpportunityInfo(opportunityValueRef.current.value)
            }
          />
        </ColorLibPaper>
      </Grid>
    </>
  );
};

export default SinglePlayerNotesComparison;
