import React, {useEffect, useState} from 'react';
import { Typography, Box, Grid, Paper, Button } from '@material-ui/core';

import useSpeechToText from './transcript';

import { firebase } from "../hooks/firebase";

const Transcription = () => {
    const [localTrans, setLocalTrans] = useState([]);
    const [str, setStr] = useState();

    // fetch trans data here
    const fetchTranscript = async (sessionID) => {
        const docRef = await firebase.firestore().collection("Transcripts").doc(sessionID);
        await docRef.get().then((doc) => {
            if (doc.exists) {
                setLocalTrans(doc.data()["text"]);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    useEffect(() => {
        fetchTranscript("testSessionID");
    }, []);

    const renderTranscript = () => {
        return localTrans.map((item) => (
            <div>
                <Box fontWeight="bold">{"00:00"}</Box>
                <Typography> {item}
                </Typography>
            </div>
        ));
    }

    return (
        <Grid item xs={12} sm={4}>
            <Paper>
                <Box m={2} height={700} overflow="auto">
                    <Box fontSize={20} fontStyle="Normal" fontWeight="fontWeightBold">
                        Transcript
                    </Box>
                    <Typography component="div" >
                        {renderTranscript()}

{/* 
                        
                        <Box fontWeight="bold">null</Box>
                        <Typography> "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        </Typography>
                        
                        <Box fontWeight="bold" >null</Box>
                        <Typography> "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        </Typography>
                        
                        <Box fontWeight="bold">null</Box>
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
                        </Typography> */}
                    </Typography>
                </Box>
            </Paper>

        </Grid>
    );
};

export default Transcription;