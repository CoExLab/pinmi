import React, { useEffect, useState } from "react";
import { Typography, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ColorLibPaper from "./layout/ColorLibComponents/ColorLibPaper";
import ColorLibTextField from "./layout/ColorLibComponents/ColorLibTextField";
import { firebase } from "../hooks/firebase";
import { useSessionValue } from "../context";

const useStyles = makeStyles((theme) => ({
  textField_font: theme.typography.body2,
}));

const Transcription = () => {
  const classes = useStyles();

  const [localTrans, setLocalTrans] = useState([]);
  const { sessionID } = useSessionValue();
  // fetch trans data here
  const fetchTranscript = async () => {
    const docRef = await firebase
      .firestore()
      .collection("sessions")
      .doc(sessionID);
    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setLocalTrans(doc.data()["transcript"]);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  useEffect(() => {
    fetchTranscript();
    // setLocalTrans([
    //   "11190 - penguin",
    //   "13685 - 2",
    //   "18213 - I hope this time you can be successfully recorded",
    //   "21508 - stop recording",
    // ]);
  }, []);

  const getTimeStamp = (transcriptString) => {
    var index = transcriptString.indexOf("-");
    if (index) {
      var tempTimeSeconds =
        parseInt(transcriptString.slice(0, index), 10) / 1000;

      return convertSecondstoTime(tempTimeSeconds);
    }
  };

  const getText = (transcriptString) => {
    var index = transcriptString.indexOf("-");
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
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    return timeString;
  };

  const renderTranscript = () => {
    return localTrans.map((item) => (
      <div style={{ margin: "8px 0px" }}>
        <ColorLibTextField
          label={<Box fontWeight="bold">{getTimeStamp(item)}</Box>}
          fullWidth
          variant="outlined"
          multiline
          margin="dense"
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
    ));
  };
  console.log(localTrans);

  return (
    <Grid item xs>
      <ColorLibPaper>
        <Box fontStyle="italic">
          <Typography>Transcript</Typography>
        </Box>
        <Typography component="div">{renderTranscript()}</Typography>
      </ColorLibPaper>
    </Grid>
  );
};

export default Transcription;
