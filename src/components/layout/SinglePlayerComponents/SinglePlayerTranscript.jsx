import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ColorLibPaper from '../../layout/ColorLibComponents/ColorLibPaper';
import ColorLibTextField from '../../layout/ColorLibComponents/ColorLibTextField';
import { firebase } from '../../../hooks/firebase';
import { useSessionValue, useSinglePlayerSessionValue } from '../../../context';
import { transcriptArr } from '../SinglePlayerModules/config';

const useStyles = makeStyles((theme) => ({
  textField_font: theme.typography.body2,
}));

const SinglePlayerTranscript = ({ selectedIndex }) => {
  const classes = useStyles();

  const [localTrans, setLocalTrans] = useState([]);
  const { sessionID } = useSessionValue();
  const { singlePlayerUsername, singlePlayerSessionID } =
    useSinglePlayerSessionValue();
  // fetch trans data here
  const fetchTranscript = async () => {
    // const docRef = await firebase
    //   .firestore()
    //   .collection("sessions")
    //   .doc(sessionID);
    // await docRef
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       setLocalTrans(doc.data()["transcript"]);
    //     } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error getting document:", error);
    //   });

    const docRef = await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(singlePlayerUsername)
      .collection('sessions')
      .doc(singlePlayerSessionID);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log(doc.data().calleeTranscript);
        setLocalTrans(doc.data().calleeTranscript);
      } else {
        console.log('no such document');
      }
    });
  };

  useEffect(() => {
    fetchTranscript();
    // setLocalTrans(transcriptArr);
  }, []);

  const getTimeStamp = (transcriptString) => {
    var index = transcriptString.indexOf('-');
    if (index) {
      var tempTimeSeconds =
        parseInt(transcriptString.slice(0, index), 10) / 1000;

      return convertSecondstoTime(tempTimeSeconds);
    }
  };

  const getText = (transcriptString) => {
    var index = transcriptString.indexOf('-');
    if (index) {
      return transcriptString.slice(index + 1);
    }
  };

  //https://www.geeksforgeeks.org/how-to-convert-seconds-to-time-string-format-hhmmss-using-javascript/
  const convertSecondstoTime = (given_seconds) => {
    var dateObj = new Date(given_seconds * 1000);
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getSeconds();

    var timeString =
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0');

    return timeString;
  };

  const renderTranscript = () => {
    return (
      localTrans &&
      localTrans.map((item, index) => (
        <div style={{ margin: '8px 0px' }}>
          <ColorLibTextField
            label={<Box fontWeight='bold'>{getTimeStamp(item)}</Box>}
            fullWidth
            variant='outlined'
            multiline
            margin='dense'
            focused={index == selectedIndex}
            // size="small"
            value={getText(item)}
            InputProps={{
              readOnly: true,
              classes: {
                input: classes.textField_font,
              },
            }}
          />
        </div>
      ))
    );
  };
  console.log(localTrans);

  return (
    <Grid item xs>
      <ColorLibPaper>
        <Box fontStyle='italic'>
          <Typography>Transcript</Typography>
        </Box>
        <Typography
          component='div'
          style={{ height: '60vh', overflow: 'scroll' }}
        >
          {renderTranscript()}
        </Typography>
      </ColorLibPaper>
    </Grid>
  );
};

export default SinglePlayerTranscript;
