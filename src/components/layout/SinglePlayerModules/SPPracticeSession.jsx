import { Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Intro from "./SPPracticeSession/Intro.jsx";
import Narrative from "./SPPracticeSession/Narrative.jsx";
import Session from "./SPPracticeSession/Session.jsx";

import {
  useActiveStepValue,
  useSessionValue,
  useSinglePlayerSessionValue,
} from "../../../context";
import ColorLibButton, {
  ColorLibNextButton,
} from "../ColorLibComponents/ColorLibButton";
import { firebase } from "../../../hooks/firebase";

function getConditionalContent(page) {
  switch (page) {
    case 0:
      return <Intro />;
    case 1:
      return <Narrative />;
    case 2:
      return <Session />;
    default:
      return <div>Unknown</div>;
  }
}

function getConditionalButton(page, setPage, setButton) {
  const handleButton = () => {
    setPage(page + 1);
    if (page === 2) setButton(true);
  };
  switch (page) {
    case 0:
      return (
        <div>
          <Box align="center" m={2} mb={20}>
            <ColorLibNextButton
              variant="contained"
              size="medium"
              onClick={() => handleButton()}
            >
              Review Information on Client
            </ColorLibNextButton>
          </Box>
        </div>
      );
    case 1:
      return (
        <div>
          <Box align="center" m={2} mb={20}>
            <ColorLibButton
              variant="contained"
              size="medium"
              onClick={() => handleButton()}
            >
              Begin Live Session
            </ColorLibButton>
          </Box>
        </div>
      );
    case 2:
      return;
    default:
      return <div>Unknown</div>;
  }
}

const PracticeSession = () => {
  const { setButton } = useSessionValue();
  const [page, setPage] = useState(0);
  const [sessionID, setSessionID] = useState();
  const { singlePlayerSessionID, setSinglePlayerSessionID } =
    useSinglePlayerSessionValue();

  const addSessionID = async () => {
    const SPSessionArr = [];
    let counter = 0;

    await firebase
      .firestore()
      .collection("singleplayer_media")
      .get()
      .then((doc) => {
        doc.forEach((d) => {
          SPSessionArr.push([d.id, d.data()]);
        });
        SPSessionArr.sort(
          (a, b) => (a[1].view_count > b[1].view_count && 1) || -1
        );
        setSinglePlayerSessionID(SPSessionArr[0][0]);
        counter = SPSessionArr[0][1].view_count;
      })

    const docRef = await firebase
      .firestore()
      .collection("singleplayer_media")
      .doc(SPSessionArr[0][0]);

    docRef.update({ view_count: counter + 1 });
  };

  useEffect(() => {
    // Scroll on render
    window.scrollTo(0, 0);
    addSessionID();
    // ["4", "7", "11", "14", "19"].map((e) => savePin(e));
  }, []);

  // //Yo-Lei - create fake data
  // const savePin = async (index) => {
  //   await firebase
  //     .firestore()
  //     .collection("singleplayer_media")
  //     .doc("g0DiUOQhbY3dKTged5II")
  //     .collection("pins")
  //     .add({
  //       pinTime: parseInt(index),
  //       callerPinNote: "yeet" + index,
  //       callerPinPerspective: "yeet" + index,
  //       callerPinCategory: "yeet" + index,
  //       callerPinSkill: "yeet" + index,
  //       calleePinNote: "yeet" + index,
  //       calleePinPerspective: "yeet" + index,
  //       calleePinCategory: "yeet" + index,
  //       calleePinSkill: "yeet" + index,
  //       pinGoal: "yeet" + index,
  //       pinStrength: "yeet" + index,
  //       pinOpportunity: "yeet" + index,
  //     })
  //     .then((docRef) => {
  //       console.log("current pin successfully updated");
  //     })
  //     .catch((e) => {
  //       console.log("pin update unsuccessful: " + e);
  //     });
  // };

  useEffect(() => {
    // Scroll on page change
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div>
      {getConditionalContent(page)}
      {getConditionalButton(page, setPage, setButton)}
    </div>
  );
};

export default PracticeSession;
