import { Box } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Intro from "./PracticeSession/Intro.jsx"
import Narrative from "./PracticeSession/Narrative.jsx"
import Session from "./PracticeSession/Session.jsx"

import { useActiveStepValue, useSessionValue } from "../../context";
import ColorLibButton, { ColorLibNextButton } from './ColorLibComponents/ColorLibButton';


function getConditionalContent(page) {
    switch (page) {
      case 0:
        return <Intro />
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
    setPage(page+1);
    if(page == 2) setButton(true);
}
    switch (page) {
      case 0:
        return (
          <div>
            <Box align='center' m = {2} mb = {20}>
              <ColorLibNextButton 
                variant='contained' 
                size='medium' 
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
            <Box align='center' m = {2} mb = {20}> 
              <ColorLibButton variant='contained' size='medium' onClick={() => handleButton()}>
                Begin Live Session
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

const PracticeSession = () => {

    const {setButton} = useSessionValue();
    const [page, setPage] = useState(0);
    return (  
        <div>
            {getConditionalContent(page)}
            {getConditionalButton(page, setPage, setButton)}
        </div>
    );
}


export default PracticeSession;