import { useState, useEffect } from 'react';
import Select from 'react-select';
import { sortBy, reverse } from 'lodash';

import { firebase } from '../../../storage/firebase';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import ColorLibButton from '../../components/colorLibComponents/ColorLibButton';
import ColorLibTextField from '../../components/colorLibComponents/ColorLibTextField';

const useStyles = makeStyles(theme => ({
  welcome_container: {
    padding: '50px 68px 50px 68px',
    textAlign: 'center',
  },
  welcome_intro: {
    color: theme.palette.teal.dark,
  },
  welcome_definition: {
    color: theme.palette.gray.main,
    fontStyle: 'italic',
    padding: '10px 20px 10px 20px',
  },
  button_wrapper: {
    marginBottom: '68px',
    textAlign: 'center',
  },
  session_container: {
    padding: '25px 34px 25px 34px',
    textAlign: 'center',
  },
}));

// Review Page thats prompts user to enter user name and select session info
const Landing = ({ firebaseUser, setReviewSessionID, setUserName }) => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [sessionsList, setSessionsList] = useState([]);

  const [sessionsByUsernamesList, setSessionsByUsernamesList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (firebaseUser) {
      firebase
        .firestore()
        .collection('sessions_by_usernames')
        .where('firebaseUser', '==', firebaseUser.uid)
        .get()
        .then(async querySnapshot => {
          if (querySnapshot.empty) {
            setSessionsByUsernamesList([]);
          } else {
            let _sessionsByUsernamesList = [];
            querySnapshot.forEach(doc => {
              _sessionsByUsernamesList.push({
                id: doc.id,
                roomId: doc.id.split('_').pop(),
              });
            });
            // console.log(_sessionsByUsernamesList);
            setSessionsByUsernamesList(_sessionsByUsernamesList);
          }
        });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (username.length) {
      updateSessionList();
    }
  }, [username]);

  //call and save all past session information based on user name entered
  const updateSessionList = async () => {
    await firebase
      .firestore()
      .collection('sessions_by_usernames')
      .doc(username)
      .get()
      .then(async doc => {
        if (doc.exists) {
          let document = await firebase
            .firestore()
            .collection('sessions_by_usernames')
            .doc(username)
            .collection('sessions')
            .get();

          let _sessions = document.docs.map(doc => {
            return {
              session: doc.id,
              username: username,
              date: doc.data().date,
              dateNumber: new Date(doc.data().date).getTime(),
            };
          });

          _sessions = reverse(sortBy(_sessions, ['dateNumber']));
          setSessionsList(_sessions);
        } else {
          setSessionsList([]);
        }
      });
  };

  //save username entered and session clicked
  const updateSessionInfo = async (session, user) => {
    setReviewSessionID(session);
    setUserName(user);
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
      </Container>
      <Container className={classes.welcome_container} maxWidth="md">
        {!firebaseUser && (
          <Box m={1} display="inline">
            <ColorLibTextField
              label="Your Unique ID"
              variant="outlined"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Box>
        )}
        {firebaseUser && (
          <Box m={1} display="inline" style={{ fontFamily: 'Lato' }}>
            <Select
              value={selectedRoom}
              onChange={e => {
                setSelectedRoom(e);
                setUsername(e.value);
              }}
              options={sessionsByUsernamesList.map(room => ({ value: room.id, label: room.roomId }))}
            />
          </Box>
        )}
      </Container>
      {sessionsList.map((s, idx) => (
        <div key={idx} className={classes.button_wrapper}>
          <ColorLibButton variant="contained" size="large" onClick={() => updateSessionInfo(s.session, s.username)}>
            {s.date}
          </ColorLibButton>
        </div>
      ))}
    </>
  );
};

export default Landing;
