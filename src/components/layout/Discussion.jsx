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


function getConditionalContent(page) {
    switch (page) {
      case 0:
        return <VideoChatComponent mode = {"Discussion"}/>;
      case 1:
        return <Collaboration />;
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
    saveEfficacyInfo(pins, sessionID);
    setPage(page+1);
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

const Discussion = () => {
    const [page, setPage] = useState(0);
    const {sessionID} = useSessionValue();
    const {pins} = usePinsValue();
    return (  
        <div>
            {getConditionalContent(page)}  
            {getConditionalButton(page, setPage, pins, sessionID)}
        </div>
    );
}


export default Discussion;