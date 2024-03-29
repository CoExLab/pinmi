import { useState, useEffect } from 'react';
import Select from 'react-select';
import { sortBy, reverse } from 'lodash';

import { firebase, rootUserIds } from '../../../storage/firebase';

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

  const [firebaseUsers, setFirebaseUsers] = useState([]);
  const [selectedFirebaseUser, setSelectedFirebaseUser] = useState(null);

  useEffect(() => {
    if (firebaseUser && rootUserIds.includes(firebaseUser.uid)) {
      firebase
        .firestore()
        .collection('firebaseUsers')
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            setFirebaseUsers([]);
          } else {
            let _firebaseUsers = [];
            querySnapshot.forEach(doc => {
              _firebaseUsers.push({
                ...doc.data(),
              });
            });
            setFirebaseUsers(_firebaseUsers);
            console.log(_firebaseUsers);
          }
        });

      setSelectedFirebaseUser({ value: firebaseUser.uid, label: firebaseUser.email });
    }

    if (firebaseUser) {
      updateSessionsList(firebaseUser.uid);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (username.length) {
      updateSessionList();
    }
  }, [username]);

  const updateSessionsList = async firebaseUserId => {
    setSessionsList([]);
    firebase
      .firestore()
      .collection('sessions_by_usernames')
      .where('firebaseUser', '==', firebaseUserId)
      .get()
      .then(async querySnapshot => {
        if (querySnapshot.empty) {
          setSessionsByUsernamesList([]);
        } else {
          let _sessionsByUsernamesList = [];
          let _sessionsList = [];
          querySnapshot.forEach(async doc => {
            _sessionsByUsernamesList.push({
              id: doc.id,
              roomId: doc.id.split('_').pop(),
            });
          });
          setSessionsByUsernamesList(_sessionsByUsernamesList);

          for (let { id, roomId } of _sessionsByUsernamesList) {
            let document = await firebase
              .firestore()
              .collection('sessions_by_usernames')
              .doc(id)
              .collection('sessions')
              .get();

            let _sessions = document.docs.map(doc => {
              return {
                session: doc.id,
                username: id,
                recordOnly: doc.data().archiveData.recordOnly,
                roomId,
                date: doc.data().date,
                dateNumber: new Date(doc.data().date).getTime(),
              };
            });

            _sessionsList = _sessionsList.concat(_sessions);
          }
          _sessionsList = reverse(sortBy(_sessionsList, ['dateNumber']));
          setSessionsList(_sessionsList);
        }
      });
  };

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
              recordOnly: doc.data().archiveData.recordOnly,
              roomId: '',
              date: doc.data().date,
              dateNumber: new Date(doc.data().date).getTime(),
            };
          });

          _sessions = reverse(sortBy(_sessions, ['dateNumber']));
          console.log(_sessions);
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
        {/* {firebaseUser && (
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
        )} */}

        {firebaseUsers && firebaseUsers.length > 0 && (
          <Box m={1} display="inline" style={{ fontFamily: 'Lato' }}>
            <Select
              value={selectedFirebaseUser}
              onChange={e => {
                setSelectedFirebaseUser(e);
                updateSessionsList(e.value);
              }}
              options={firebaseUsers.map(user => ({ value: user.uid, label: user.email }))}
            />
          </Box>
        )}
      </Container>
      {sessionsList.map((s, idx) => (
        <div key={idx} className={classes.button_wrapper}>
          <ColorLibButton variant="contained" size="large" onClick={() => updateSessionInfo(s.session, s.username)}>
            {s.date} -- Room {s.roomId.substr(0, s.roomId.length - 1)}:{' '}
            {s.roomId[s.roomId.length - 1] === 'a' ? 'therapist' : 'client'}
            {s.recordOnly ? ' [record only]' : ''}
          </ColorLibButton>
        </div>
      ))}
    </>
  );
};

export default Landing;
