import { Button, Box } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import Intro from "./PracticeSession/Intro.jsx"
import Narrative from "./PracticeSession/Narrative.jsx"
import Session from "./PracticeSession/Session.jsx"



function getConditionalContent(page) {
    switch (page) {
      case 0:
        return <Intro />
      case 1:
        return <Narrative />;
      case 2:
        return <Session /> ;
      default:
        return <div>Unknown</div>;
    }
}

function getConditionalButton(page, setPage) {
    switch (page) {
      case 0:
        return <div><Box align="center" m = {2}> <Button variant="contained" color="primary" onClick={() => setPage(page+1)}>Review Client Information</Button></Box></div>;
      case 1:
        return <div><Box align="center" m = {2}> <Button variant="contained" color="primary" onClick={() => setPage(page+1)}>Begin Live Session</Button></Box></div>;
      case 2:
        return ;
      default:
        return <div>Unknown</div>;
    }
}

const PracticeSession = () => {
    const [page, setPage] = useState(0);
    const handleButton = () => {
        setPage(page+1);
    }

    return (  
        <div>
            {getConditionalContent(page)}
            {getConditionalButton(page, setPage)}
        </div>
    );
}


export default PracticeSession;