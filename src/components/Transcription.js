import React from 'react';
import { Typography, Box, Grid, Paper } from '@material-ui/core';

const Transcription = () => {
    // fetch pin data here
    // todo...

    return (
        <Grid item xs={12} sm={4}>
            <Paper>
                <Box m={2} height={700} overflow="auto">
                    <Box fontSize={20} fontStyle="Normal" fontWeight="fontWeightBold">
                        Transcript
                    </Box>
                    <Typography component="div" >
                        <Box fontWeight="bold">0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                        <Box fontWeight="bold" >0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                        <Box fontWeight="bold">0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                        <Box fontWeight="bold">0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                        <Box fontWeight="bold">0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                        <Box fontWeight="bold">0:03</Box>
                        <Typography> Am I starting now? Um, I guess, should I ask the person to continue thinking out loud? I guess? Yeah, we can share this soon or yeah, you can think out loud for this part too. Okay.
                        </Typography>
                    </Typography>
                </Box>
            </Paper>

        </Grid>
    );
};

export default Transcription;