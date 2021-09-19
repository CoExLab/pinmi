import React, {useState} from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import { Fragment } from 'react';
import { useUserModeValue, useActiveStepValue } from '../../context';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import ColorLibToggleButton, { ColorLibToggleButtonGroup } from './ColorLibComponents/ColorLibToggleButton';
import ColorLibPaper from './ColorLibComponents/ColorLibPaper';
import Typography from '@material-ui/core/Typography';

const Refresher = () => {
	const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();
	const [question1Ans, setQuestion1Ans] = useState('');
	const [question2Ans, setQuestion2Ans] = useState('');

	const {userMode, setUserMode} = useUserModeValue();

	const handleUserMode = (event, newMode) => {
		if (newMode !== null) {
			setUserMode(newMode);
		}
	};

	const handleQestion1 = (event, newAns) => {
	  if (newAns !== null) {
		setQuestion1Ans(newAns);
	  }
	};

	const handleQestion2 = (event, newAns) => {
		if (newAns !== null) {
		  setQuestion2Ans(newAns);
		}
	  };

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	return (
		<Fragment>
      <Container maxWidth='md'>
        <Box align="left" m = {2}> 
          <ColorLibToggleButtonGroup
            value={userMode}
            exclusive
            onChange={handleUserMode}
          >
            <ColorLibToggleButton size="small" value="caller">
              Caller
            </ColorLibToggleButton>
            <ColorLibToggleButton size="small" value="callee">
              Callee
            </ColorLibToggleButton>
          </ColorLibToggleButtonGroup>
        </Box>
        <Typography variant='h2'>
          Complete the exercises to unlock today’s session!
        </Typography>
        <Grid container style={{marginTop: '20px'}}>
          <Grid item xs={9}>
            <Typography variant='body1' style={{marginRight: '12px'}}>
              Closed questions are bad.
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <ColorLibToggleButtonGroup
              value={question1Ans}
              exclusive
              onChange={handleQestion1}
            >
              <ColorLibToggleButton size="small" value="true">
                True
              </ColorLibToggleButton>
              <ColorLibToggleButton size="small" value="false">
                False
              </ColorLibToggleButton>
            </ColorLibToggleButtonGroup>
          </Grid>
          {question1Ans === '' ? null :
          <ColorLibPaper elevation={9} style={{margin:'15px 0px'}}>
            <Typography variant="body2">
              {question1Ans === "false" ? "Correct!" : "Sorry, try again."} Closed questions are not “bad.” They simply are limited as a tool, so we try to avoid using them in favor of open-ended questions. However, there are situations in which closed questions are desirable. In general, the aim is to ask more open-ended than closed questions.
            </Typography>
          </ColorLibPaper>
          }
        </Grid>
        <Grid container style={{marginTop: '20px'}}>
          <Grid item xs={9}>
            <Typography variant='body1' style={{marginRight: '12px'}}> 
              We use reflections to help clients not only see what they've told us, but to also help organize and understand their experience.
            </Typography>
          </Grid>
          <Grid item xs={3}>        
            <ColorLibToggleButtonGroup
              value={question2Ans}
              exclusive
              onChange={handleQestion2}
            >
              <ColorLibToggleButton size="small" value="true">
                True
              </ColorLibToggleButton>
              <ColorLibToggleButton size="small" value="false">
                False
              </ColorLibToggleButton>
            </ColorLibToggleButtonGroup>
          </Grid>
          {question2Ans === '' ? null :
          <ColorLibPaper elevation={9} style={{margin:'15px 0px'}}>
            <Typography variant="body2">
              {question2Ans === "true" ? "Correct!" : "Sorry, try again."} If we simply hold up the mirror, then we aren’t helping clients become unstuck. In addition to helping clients hear again what they’re told us, we also selectively attend to certain elements and not to others and then present that information back in a manner that helps them attain greater understanding of their situation
            </Typography>
          </ColorLibPaper>}
        </Grid>
        <Typography variant='h4' style={{marginTop: '50px'}}>
          Practicing Open-ended Questions
        </Typography>
        <Typography variant='body1' style={{marginTop: '10px'}}> 
          Are you doing OK today?                                
        </Typography>
        <ColorLibTextField
            id="outlined-secondary"
            label="Convert the closed question to open-ended..."
            fullWidth
            variant="outlined"
            multiline
            rowsMax={2}
            margin="normal"       
        />
        <Typography variant='body1' style={{marginTop: '10px'}}> 
          How much do you drink on a typical drinking occasion?                               
        </Typography>
        <ColorLibTextField
            id="outlined-secondary"
            label="Convert the closed question to open-ended..."
            fullWidth
            variant="outlined"
            multiline
            rowsMax={2}
            margin="normal"
        />
        <Typography variant='body1' style={{marginTop: '10px'}}> 
          I don’t get what we’re supposed to be doing here.                               
        </Typography>
        <ColorLibTextField
          id="outlined-secondary"
          label="Form a question in response to the client statement..."
          fullWidth
          variant="outlined"
          multiline
          rowsMax={2}
          margin="normal"
        />
        <Typography variant='body1' style={{marginTop: '10px'}}> 
          I love my kids, but sometimes they push me to the edge, and then I do things I shouldn’t.
        </Typography>
        <ColorLibTextField
            id="outlined-secondary"
            label="Form a question in response to the client statement..."
            fullWidth
            variant="outlined"
            multiline
            rowsMax={2}
            margin="normal"
        />
      </Container>
      
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0px 50px 0px'}}>
        <ColorLibButton variant='outlined' size='medium' onClick={handleNext}>
          Submit
        </ColorLibButton>
			</div>
			
		</Fragment>
	);
}
 
export default Refresher;