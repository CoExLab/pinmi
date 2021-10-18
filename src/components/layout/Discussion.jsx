import { Button, Box } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Collaboration from "./Collaboration.jsx"
import VideoChatComponent from "../VideoDiscussion.js"

import VideoChatComponentSecond from "../VideoDiscussionSecond.js";
import { ColorLibNextButton } from './ColorLibComponents/ColorLibButton';
import ColorLibButton from './ColorLibComponents/ColorLibButton';

import firebase from 'firebase';

//context
import {useSessionValue, usePinsValue } from "../../context";




const Discussion = () => {
    const [page, setPage] = useState(0);
    const {sessionID} = useSessionValue();
    const {pins} = usePinsValue();

    const [finishedUpdates, setFinishedUpdates] = useState(false);

  const [curPinIndex, setCurPinIndex] = useState(0);
  const [prevPinIndex, setPrevPinIndex] = useState(0);

  useEffect(() => {
    if(finishedUpdates)
    {
      saveEfficacyInfo(pins, sessionID);
      setPage(page+1);
    }
  }, [finishedUpdates]);

  function getConditionalContent(page) {
    switch (page) {
      case 0:
        return <VideoChatComponent mode = {"Discussion"}/>;
      case 1:
        return <Collaboration curPinIndex= {curPinIndex} setCurPinIndex={setCurPinIndex} prevPinIndex={prevPinIndex} setPrevPinIndex={setPrevPinIndex}/>;
      case 2:
        return <VideoChatComponentSecond />;
      default:
        return <div>Unknown</div>;
    }
}

const saveEfficacyInfo = async (pins, sessionID) => {
  pins.map(async (p) => {
    await firebase.firestore().collection("sessions").doc(sessionID).collection("pins").doc(p.pinID).update({
      pinEfficacy: p.pinEfficacy
    })
  })
}

function getConditionalButton(page, setPage, pins, sessionID) {
  
  const handleButton = () => {
    setPrevPinIndex(curPinIndex);
    setCurPinIndex(0);
    setFinishedUpdates(true);
}
    switch (page) {
      case 0:
        return (
          <div>
            <Box align='center' m = {2} mb = {20}> 
              <ColorLibNextButton variant='contained' size='medium' onClick={() => handleButton()}>
                Let's talk about our pins
              </ColorLibNextButton>
            </Box>
          </div>
        );
      case 1:
        return (
          <div>
            <Box align='center' m = {2} mb = {20}> 
              <ColorLibButton variant='contained' size='medium' onClick={() => handleButton()}>
                Finish Discussing Pins
              </ColorLibButton>
            </Box>
          </div>
        );
      case 2:
        return ;
      default:
        return <div>Unknown</div>;
    }
}
    return (  
        <div>
            {getConditionalContent(page)}  
            {getConditionalButton(page, setPage, pins, sessionID)}
        </div>
    );
}


export default Discussion;