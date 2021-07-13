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
                        <Typography> "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        </Typography>
                        <Box fontWeight="bold" >0:10</Box>
                        <Typography> "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        </Typography>
                        <Box fontWeight="bold">0:20</Box>
                        <Typography> "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                        </Typography>
                        <Box fontWeight="bold">0:32</Box>
                        <Typography> "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
                        </Typography>
                        <Box fontWeight="bold">0:55</Box>
                        <Typography> "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetu."
                        </Typography>
                        <Box fontWeight="bold">1:08</Box>
                        <Typography> "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
                        </Typography>
                        <Box fontWeight="bold">1:44</Box>
                        <Typography> "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
                        </Typography>
                    </Typography>
                </Box>
            </Paper>

        </Grid>
    );
};

export default Transcription;