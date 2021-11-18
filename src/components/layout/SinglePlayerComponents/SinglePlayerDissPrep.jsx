import React, { useState, useEffect } from "react";
// Components
import SinglePlayerAudioReview from "./SinglePlayerAudioReview";
import Transcription from "../../Transcription";
import { firebase } from "../../../hooks/firebase";
import { useSessionValue } from "../../../context";
import Notetaking from "../../Notetaking";
import SinglePlayerTranscript from "./SinglePlayerTranscript";
import SinglePlayerNotetaking from "./SinglePlayerNotetaking";

const SinglePlayerDissPrep = ({
  curPinIndex,
  setCurPinIndex,
  prevPinIndex,
  setPrevPinIndex,
}) => {
  // const [localTrans, setLocalTrans] = useState([]);
  const { sessionID } = useSessionValue();
  // // fetch trans data here
  // const fetchTranscript = async () => {
  //   const docRef = await firebase
  //     .firestore()
  //     .collection("sessions")
  //     .doc(sessionID);
  //   await docRef
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         const ts = getTimeStamp(doc.data()["transcript"]);
  //         setLocalTrans(ts);
  //       } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error getting document:", error);
  //     });
  // };

  // useEffect(() => {
  //   fetchTranscript();
  // }, []);

  // const getTimeStamp = (transcriptArr) => {
  //   return (
  //     transcriptArr &&
  //     transcriptArr.map((transcriptString) => {
  //       var index = transcriptString.indexOf("-");
  //       if (index) {
  //         var tempTimeSeconds = Math.floor(
  //           parseInt(transcriptString.slice(0, index), 10) / 1000
  //         );

  //         return tempTimeSeconds;
  //       }
  //     })
  //   );
  // };

  return (
    <>
      <SinglePlayerAudioReview
        curPinIndex={curPinIndex}
        setCurPinIndex={setCurPinIndex}
        prevPinIndex={prevPinIndex}
        setPrevPinIndex={setPrevPinIndex}
        // transcript={localTrans}
      />
      {/* <Transcription /> */}
      <SinglePlayerTranscript />
      <SinglePlayerNotetaking
        curPinIndex={curPinIndex}
        setCurPinIndex={setCurPinIndex}
        prevPinIndex={prevPinIndex}
        setPrevPinIndex={setPrevPinIndex}
      />
    </>
  );
};

export default SinglePlayerDissPrep;
