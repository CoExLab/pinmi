import React, {useState} from 'react';
import { Box, Container } from '@material-ui/core';
import { Fragment } from 'react';

import ColorLibButton from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import { useActiveStepValue } from '../../context';

const SelfReflection = () => {
    const {curActiveStep: activeStep, setCurActiveStep: setActiveStep} = useActiveStepValue();
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    return (
        <Fragment>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                <Container maxWidth="md">
                    <Box fontStyle="normal" fontSize={25} textAlign="center" fontWeight="fontWeightBold" >
                        Reflect on how the session went and how you felt.
                    </Box>
                    <Box mt = {2} fontStyle="normal" fontSize={20} textAlign="center" fontWeight="fontWeightBold" >
                        Based on today’s session
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What do I feel like are my strengths?                              
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                label="Type a strength and press Enter to add"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"
                        />
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What are some opportunities for growth?
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                label="Type and opportunity and press Enter to add"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"
                        />
                    </Box>
                    <Box mt = {2} fontStyle="normal" fontSize={20} textAlign="center" fontWeight="fontWeightBold" >
                        Make a plan
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What steps will I take to improve?                              
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"                        
                        />
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What obstacles might get in the way, and how will I overcome them?                                
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"                        
                        />
                    </Box>
                    <Box mt = {2} fontStyle="normal" fontSize={20} textAlign="center" fontWeight="fontWeightBold" >
                        Prepare for change
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What would I like to add to my clinical practice?                            
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"                        
                        />
                    </Box>
                    <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" pl={3.5}> 
                        What else would I like to keep reflecting on during the next week?                               
                    </Box>
                    <Box pl = {3.5} width = {900} >
                        <ColorLibTextField
                                id="outlined-secondary"
                                fullWidth
                                variant="outlined"
                                multiline
                                rowsMax={2}
                                margin="normal"                        
                        />
                    </Box>
                </Container>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '50px 0px'}}>
                <ColorLibButton 
                    variant="contained"
                    size="medium"
                    onClick={handleNext}
                >
                    Finish Self-Reflection
                </ColorLibButton>
            </div>
        </Fragment>
    );
}
 
export default SelfReflection;