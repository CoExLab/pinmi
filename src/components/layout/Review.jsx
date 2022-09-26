import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { sortBy, reverse } from 'lodash';

import { firebase, rootUserIds } from '../../hooks/firebase';

import Navbar from './Navbar';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';

import { useUser } from '../../context/userContext';

const useStyles = makeStyles((theme) => ({
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
const Review = () => {
  const classes = useStyles();

  const [sessionsList, setSessionsList] = useState([]);

  const [firebaseUsers, setFirebaseUsers] = useState([]);
  const [selectedFirebaseUser, setSelectedFirebaseUser] = useState(null);

  const { user: firebaseUser } = useUser();

  const history = useHistory();

  useEffect(() => {
    if (firebaseUser && rootUserIds.includes(firebaseUser.uid)) {
      firebase
        .firestore()
        .collection('firebaseUsers')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            setFirebaseUsers([]);
          } else {
            let _firebaseUsers = [];
            querySnapshot.forEach(async (doc) => {
              let fbUser = {
                ...doc.data(),
              };

              _firebaseUsers.push(fbUser);
            });
            setFirebaseUsers(_firebaseUsers);
            console.log(_firebaseUsers);
          }
        });
    }

    if (firebaseUser) {
      updateSessionsList(firebaseUser.uid);
      setSelectedFirebaseUser({
        value: firebaseUser.uid,
        label: firebaseUser.email,
      });
    }
  }, [firebaseUser]);

  const updateSessionsList = async (firebaseUserId) => {
    console.log(firebaseUserId);
    setSessionsList([]);

    firebase
      .firestore()
      .collection('singleplayer')
      .doc(firebaseUserId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          snapshot.ref
            .collection('sessions')
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                setSessionsList([]);
              } else {
                let _sessions = [];
                querySnapshot.forEach(async (doc) => {
                  let _session = {
                    id: doc.id,
                    ...doc.data(),
                    dateNumber: new Date(doc.data().date).getTime(),
                  };
                  _sessions.push(_session);
                });
                // console.log(_sessions);
                _sessions = reverse(sortBy(_sessions, ['dateNumber']));
                setSessionsList(_sessions);
              }
            });
        }
      });
  };

  //save username entered and session clicked
  const updateSessionInfo = async (s) => {
    // history.push(
    //   `/reviewsingleplayer?uid=${selectedFirebaseUser.value}&sid=${s.id}&refuid=${s.refUsername}&refsid=${s.refSessionID}`
    // );
  };

  return (
    <>
      <Navbar />
      <Container className={classes.welcome_container} maxWidth='md'>
        <Typography variant='h1' className={classes.welcome_intro}>
          Review Past Pin-MI Sessions
        </Typography>
      </Container>
      <Container className={classes.welcome_container} maxWidth='md'>
        {firebaseUsers && firebaseUsers.length > 0 && (
          <Box m={1} display='inline' style={{ fontFamily: 'Lato' }}>
            <Select
              value={selectedFirebaseUser}
              onChange={(e) => {
                setSelectedFirebaseUser(e);
                updateSessionsList(e.value);
              }}
              options={firebaseUsers.map((user) => ({
                value: user.uid,
                label: user.email,
              }))}
            />
          </Box>
        )}
      </Container>
      {sessionsList.map((s, idx) => (
        <div key={idx} className={classes.button_wrapper}>
          <SessionPill s={s} selectedFirebaseUser={selectedFirebaseUser} />
        </div>
      ))}
    </>
  );
};

const SessionPill = ({ s, selectedFirebaseUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ColorLibButton
      variant='contained'
      size='large'
      onClick={() => setShowDetails(!showDetails)}
    >
      {!showDetails ? (
        <>
          {s.date} {s.completed && '[Completed]'}
        </>
      ) : (
        <>
          {`uid=${selectedFirebaseUser.value}`}
          <br />
          {`session=${s.id}`}
          <br />
          {s.date} &nbsp;{s.completed && '[Completed]'}
          {/* {`uid=${selectedFirebaseUser.value}&sid=${s.id}&refuid=${s.refUsername}&refsid=${s.refSessionID}`} */}
        </>
      )}
    </ColorLibButton>
  );
};

export default Review;
