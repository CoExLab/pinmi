import DisscussionPrep from './discussionPrep/DisscussionPrep';
import PracticeSession from './practiceSession/PracticeSession';
import Refresher from './misc/Refresher';
import SelfReflection from './reflection/SelfReflection';
import Discussion from './discussion/Discussion';
// context
import { useActiveStepValue, useSessionValue } from '../../storage/context';

//tbr import { usePins } from '../../hooks/index';

function getStepContent(step) {
  switch (step) {
    case 0:
      return <PracticeSession />;
    case 1:
      return <DisscussionPrep />;
    case 2:
      return <Discussion />;
    case 3:
      return <SelfReflection />;
    default:
      return <div>Unknown</div>;
  }
}

// steps through Practice Session, Self-Reflection Prep, Discussion, Self Reflection pages
const Modules = () => {
  const { sessionID } = useSessionValue();
  const { curActiveStep } = useActiveStepValue();
  // const curActiveStep = 1;
  //tbr const { pins } = usePins();

  return <div>{getStepContent(curActiveStep)}</div>;
};

export default Modules;
