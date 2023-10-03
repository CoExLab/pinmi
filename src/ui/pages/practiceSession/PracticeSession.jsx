import { Box } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Intro from './Intro.jsx';
import Narrative from './Narrative';
import Session from './Session';

import { useSessionValue } from '../../../storage/context';
import ColorLibButton, { ColorLibNextButton } from '../../components/colorLibComponents/ColorLibButton';

function getConditionalContent(page) {
  switch (page) {
    case 0:
      return <Intro />;
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
    setPage(page + 2);
    if (page === 2) setButton(true);
  };
  switch (page) {
    case 0:
      return (
        <div>
          <Box align="center" m={2} mb={20}>
            <ColorLibNextButton variant="contained" size="medium" onClick={() => handleButton()}>
              Begin Live Session
            </ColorLibNextButton>
          </Box>
        </div>
      );
    case 1:
      return (
        <div>
          <Box align="center" m={2} mb={20}>
            <ColorLibButton variant="contained" size="medium" onClick={() => handleButton()}>
              Begin Live Session
            </ColorLibButton>
          </Box>
        </div>
      );
    case 2:
      return;
    default:
      return <div>Unknown</div>;
  }
}

const PracticeSession = () => {
  const session = useSelector(state => state.session);
  console.log(session);
  const { setButton } = useSessionValue();
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Scroll on render
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Scroll on page change
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div>
      {getConditionalContent(page)}
      {getConditionalButton(page, setPage, setButton)}
    </div>
  );
};

export default PracticeSession;
