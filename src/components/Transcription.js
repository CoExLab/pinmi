import React, {useEffect, useState} from 'react';
import { Typography, Box, Grid, Paper } from '@material-ui/core';

import useSpeechToText from './transcript';

import { firebase } from "../hooks/firebase";

const Transcription = () => {
    const [localTrans, setLocalTrans] = useState([]);

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

    const getTimeStamp = (transcriptString) => {
        var index = transcriptString.indexOf("-");
        if (index) {
            return (transcriptString.slice(0,index));
        }
    }

    const getText = (transcriptString) => {
        var index = transcriptString.indexOf("-");
        if (index) {
            return (transcriptString.slice(index + 1));
        }
    }

    const renderTranscript = () => {
        return localTrans.map((item) => (
            <div>
                <Box fontWeight="bold">{getTimeStamp(item)}</Box>
                <Typography> {getText(item)}
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