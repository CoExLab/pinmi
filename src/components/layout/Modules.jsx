import React from 'react';
import DisscussionPrep from './DisscussionPrep';
import PracticeSession from './PracticeSession';
import Collaboration from './Collaboration';
import Refresher from './Refresher';
import SelfReflection from './SelfReflection';
import SPDiscussion from './SinglePlayerModules/SPDiscussion';
import SPPracticeSession from './SinglePlayerModules/SPPracticeSession';
import Discussion from './Discussion';
// context
import {
  useActiveStepValue,
  useSessionValue,
  usePlayerModeValue,
} from '../../context';

import { usePins } from '../../hooks/index';
import SPDisscussionPrep from './SinglePlayerModules/SPDiscussionPrep';

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

function getSPStepContent(step) {
  switch (step) {
    case 0:
      return <SPPracticeSession />;
    case 1:
      return <SPDisscussionPrep />;
    case 2:
      return <SPDiscussion />;
    case 3:
      return <SelfReflection />;
    default:
      return <div>Unknown</div>;
  }
}

const Modules = () => {
  const { sessionID } = useSessionValue();
  const { curActiveStep } = useActiveStepValue();
  // const { playerMode } = usePlayerModeValue();
  const playerMode = 'singleplayer';
  const { pins } = usePins();

  return (
    <div>
      {playerMode == 'multiplayer'
        ? getStepContent(curActiveStep)
        : getSPStepContent(curActiveStep)}
    </div>
  );
};

export default Modules;
