import { useState, useEffect } from "react";
import { useRef } from "react";

import { firebase } from "../../../storage/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import ColorLibButton from "../../components/colorLibComponents/ColorLibButton";
import ColorLibTextField from "../../components/colorLibComponents/ColorLibTextField";

const useStyles = makeStyles((theme) => ({
  welcome_container: {
    padding: "50px 68px 50px 68px",
    textAlign: "center",
  },
  welcome_intro: {
    color: theme.palette.teal.dark,
  },
  welcome_definition: {
    color: theme.palette.gray.main,
    fontStyle: "italic",
    padding: "10px 20px 10px 20px",
  },
  button_wrapper: {
    marginBottom: "68px",
    textAlign: "center",
  },
  session_container: {
    padding: "25px 34px 25px 34px",
    textAlign: "center",
  },
}));

// Review Page thats prompts user to enter user name and select session info
const Landing = (props) => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [sessionsList, setSessionsList] = useState([]);
  const usernameRef = useRef("");

  useEffect(() => {
    if (username.length) {
      updateSessionList();
    }
  }, [username]);

  //call and save all past session information based on user name entered
  const updateSessionList = async () => {
    await firebase
      .firestore()
      .collection("sessions_by_usernames")
      .doc(username)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          let document = await firebase
            .firestore()
            .collection("sessions_by_usernames")
            .doc(username)
            .collection("sessions");

          document.get().then((e) => {
            let L1 = e.docs.map((doc) => {
              return { session: doc.id, date: doc.data().date };
            });
            setSessionsList(L1);
          });
        } else {
          setSessionsList([]);
        }
      });
  };

  //save username entered and session clicked
  const updateSessionInfo = async (session) => {
    props.setReviewSessionID(session);
    props.setUserName(username);
  };

  return (
    <>
      <Container className={classes.welcome_container} maxWidth="md">
        <Typography variant="h1" className={classes.welcome_intro}>
          Review Past Pin-MI Sessions
        </Typography>
        <Typography variant="h3" className={classes.welcome_definition}>
          enter your unique ID to review and edit your past sessions with peers
        </Typography>
        <br />
      </Container>
      <Container className={classes.welcome_container} maxWidth="md">
        <Box m={1} display="inline">
          <ColorLibTextField
            id="outlined-basic"
            label="Your Unique ID"
            variant="outlined"
            value={username}
            inputRef={usernameRef}
            onChange={() => setUsername(usernameRef.current.value)}
          />
        </Box>
      </Container>
      {sessionsList.map((s) => (
        <div className={classes.button_wrapper}>
          <ColorLibButton
            variant="contained"
            size="large"
            onClick={() => updateSessionInfo(s.session)}
          >
            {s.date}
          </ColorLibButton>
        </div>
      ))}
    </>
  );
};

export default Landing;
