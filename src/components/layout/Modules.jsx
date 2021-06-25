import React from 'react';
import DisscussionPrep from './DisscussionPrep';
import PracticeSession from './PracticeSession';
import Collaboration from  './Collaboration';
// context
import { useActiveStepValue } from "../../context";

import { usePins } from '../../hooks/index';

function getStepContent(step) {
    switch (step) {
      case 0:
        return <div>refresher</div>;
      case 1:
        return <PracticeSession />;
      case 2:
        return <DisscussionPrep/> ;
      case 3:
        return <Collaboration />;
      case 4:
        return <div>reflection</div>;
      case 5:
        return <div>complete</div>;
      default:
        return <div>Unknown</div>;
    }
}

const Modules = () => {    
    const {curActiveStep} = useActiveStepValue();
    const { pins } = usePins();
    
    return (  
        <div>
            {getStepContent(curActiveStep)}
        </div>
    );
}
 
export default Modules;