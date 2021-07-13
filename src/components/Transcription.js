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
                    </Typography>
                </Box>
            </Paper>

        </Grid>
    );
};

export default Transcription;