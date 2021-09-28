import React from 'react';
import DisscussionPrep from './DisscussionPrep';
import PracticeSession from './PracticeSession';
import Collaboration from  './Collaboration';
import Refresher from './Refresher';
import SelfReflection from './SelfReflection';
import Discussion from './Discussion';
// context
import { useActiveStepValue } from "../../context";

import { usePins } from '../../hooks/index';



function getStepContent(step) {
    switch (step) {
      case 0:
        return <Refresher />
      case 1:
        return <PracticeSession />;
      case 2:
        return <DisscussionPrep/> ;
      case 3:
        return <Discussion />;
      case 4:
        return <SelfReflection />;
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