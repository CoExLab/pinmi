import React, {useState} from 'react';
import { Paper, Box, TextField, Grid } from '@material-ui/core';
import { Fragment } from 'react';

const SelfReflection = () => {
    return (
        <Fragment>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                    <Paper >
                        <Grid container spacing={1}>
                            <Box m={2} height={800} width = {1000} overflow="auto">
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
                                    <TextField
                                            id="outlined-secondary"
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
                                    <TextField
                                            id="outlined-secondary"
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
                                    <TextField
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
                                    <TextField
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
                                    <TextField
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
                                    <TextField
                                            id="outlined-secondary"
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rowsMax={2}
                                            margin="normal"                        
                                    />
                                </Box>



                            </Box>
                        </Grid>
                    </Paper>

            </div>
        </Fragment>
    );
}
 
export default SelfReflection;