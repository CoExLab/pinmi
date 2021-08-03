import React, {useState} from 'react';
import { Paper, Box, TextField, Grid, Button } from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Fragment } from 'react';
import { useUserModeValue } from '../../context';

const Refresher = () => {

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

    return (
        <Fragment>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                    <Paper >
                        <Grid container spacing={1}>
                            <Box m={2} height={700} width = {1000} overflow="auto">
                                <Box align="left" m = {2}>          
                                    <ToggleButtonGroup
                                        value={userMode}
                                        exclusive
                                        onChange={handleUserMode}
                                    >
                                        <ToggleButton value="Interviewer" aria-label="left aligned">
                                            Interviewer
                                        </ToggleButton>
                                        <ToggleButton value="Client" aria-label="centered">
                                            Client
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>  
                                <Box fontStyle="normal" fontSize={25} textAlign="center" fontWeight="fontWeightBold" >
                                    Complete the exercises to unlock today's session!
                                </Box>
                                <div style={{ display: 'flex' }}>
                                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={3.5}> 
                                        OARS are basic skills practitioners often have in their clinical toolbox already.
                                    </Box>
                                    <Box align="left" m = {2}>          
                                        <ToggleButtonGroup
                                            value={question1Ans}
                                            exclusive
                                            onChange={handleQestion1}
                                        >
                                            <ToggleButton value="true" aria-label="left aligned">
                                                True
                                            </ToggleButton>
                                            <ToggleButton value="false" aria-label="centered">
                                                False
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>  
                                </div>
                                {question1Ans === '' ? null :
                                <Box fontStyle="italic" pl = {3.5} textAlign="left" fontSize={16} fontWeight="fontWeightMedium">
                                    {question1Ans === "true" ? "Correct!" : "Sorry, try again."} OARS are not unique to MI and are often already in practitioners’ skill repertoire. The unique aspect of OARS in MI is the deployment of those skills in a directive manner.
                                </Box>}
                                <div style={{ display: 'flex' }}>
                                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={3.5}> 
                                        We use OARS to help clients not only see what they've told us, but to also help organize and understand their experience.
                                    </Box>
                                    <Box align="left" m = {2}>          
                                        <ToggleButtonGroup
                                            value={question2Ans}
                                            exclusive
                                            onChange={handleQestion2}
                                        >
                                            <ToggleButton value="true" aria-label="left aligned">
                                                True
                                            </ToggleButton>
                                            <ToggleButton value="false" aria-label="centered">
                                                False
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>  
                                </div>
                                {question2Ans === '' ? null :
                                <Box fontStyle="italic" pl = {3.5} textAlign="left" fontSize={16} fontWeight="fontWeightMedium">
                                    {question2Ans === "true" ? "Correct!" : "Sorry, try again."} If we simply hold up the mirror, then we aren’t helping clients become unstuck. In addition to helping clients hear again what they’re told us, we also selectively attend to certain elements and not to others and then present that information back in a manner that helps them attain greater understanding of their situation
                                </Box>}

                                <Box pt = {1} fontStyle="normal" fontSize={20} textAlign="center" fontWeight="fontWeightBold" >
                                    Practicing Open-ended Questions
                                </Box>
                                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                                    Are you doing OK today?                                
                                </Box>
                                <Box pl = {3.5} width = {900} >
                                    <TextField
                                            id="outlined-secondary"
                                            label="Convert the closed question to open-ended..."
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rowsMax={2}
                                            margin="normal"                        
                                    />
                                </Box>
                                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                                    How much do you drink on a typical drinking occasion?                               
                                </Box>
                                <Box pl = {3.5} width = {900} >
                                    <TextField
                                            id="outlined-secondary"
                                            label="Convert the closed question to open-ended..."
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rowsMax={2}
                                            margin="normal"                        
                                    />
                                </Box>
                                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                                    I don’t get what we’re supposed to be doing here.                               
                                </Box>
                                <Box pl = {3.5} width = {900} >
                                    <TextField
                                            id="outlined-secondary"
                                            label="Form a question in response to the client statement..."
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rowsMax={2}
                                            margin="normal"                        
                                    />
                                </Box>
                                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                                    I love my kids, but sometimes they push me to the edge, and then I do things I shouldn’t.                                
                                </Box>
                                <Box pl = {3.5} width = {900} >
                                    <TextField
                                            id="outlined-secondary"
                                            label="Form a question in response to the client statement..."
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rowsMax={2}
                                            margin="normal"                        
                                    />
                                </Box>
                                {/* <Box pl = {52}>
                                    <Button  variant="contained" color="secondary">
                                        Submit
                                    </Button>
                                </Box> */}
                            </Box>
                        </Grid>
                    </Paper>

            </div>
        </Fragment>
    );
}
 
export default Refresher;