import { Button } from '@material-ui/core';
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

function getConditionalButton(page) {
    switch (page) {
      case 0:
        return "Review Client Information"
      case 1:
        return "Begin Live Session";
      case 2:
        return "Begin Discussion Prep";
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
            <Button onClick={() => setPage(page+1)}>{getConditionalButton(page)}</Button>
        </div>
    );
}


export default PracticeSession;