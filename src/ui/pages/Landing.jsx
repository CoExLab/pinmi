import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { firebase } from '../../storage/firebase';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import Select from 'react-select';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ColorLibButton from '../components/colorLibComponents/ColorLibButton';
import ColorLibTextField from '../components/colorLibComponents/ColorLibTextField';
import Navbar from '../components/Navbar';

import pinningPreview from './../../other/tutorial/pinning-preview.gif';
import modal from './../../other/tutorial/modal.png';
// import discussionPrepPreview from './../../other/tutorial/discussionPrepPreview.png';
import discussionPreview from './../../other/tutorial/discussionPreview.png';

import { setUserID, setUserMode, setUserRoom, setSessionID, setRecordOnly } from '../../storage/store';

import { useUser } from '../../contexts/userContext';
import { useActiveStepValue, usePinsValue, useSessionValue } from '../../storage/context';

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
  tutorial_even: {
    padding: '0 65px',
    background: theme.palette.teal.lighter + ' 50%',
    height: '400px',
  },
  tutorial_odd: {
    padding: '0 65px',
    background: 'white',
    height: '400px',
  },
  tutorial_grid: {
    alignSelf: 'center',
  },
  tutorial_text: {
    textAlign: 'center',
  },
  tutorial_text_left: {
    marginRight: 0,
    marginLeft: 'auto',
    textAlign: 'center',
  },
}));

const tutorialInfo = [
  {
    text: 'Use pins to mark moments of MI strengths and opportunities in a conversation',
    image: pinningPreview,
    alt: 'Pinning',
  },
  // {
  //   text: 'during a practitioner-client role-playing session with a peer',
  //   image: modal,
  //   alt: 'Role-playing session modal',
  // },
  // {
  //   text: 'and after to reflect on the conversation and prepare for',
  //   image: discussionPrepPreview,
  //   alt: 'Discussion Prep Interface',
  // },
  // {
  //   text: 'a collaborative discussion with your peer to share thoughts and specific feedback on those pinned moments.',
  //   image: discussionPreview,
  //   alt: 'Discussion Interface',
  // },
];

// Project Page
const Landing = ({ justchat }) => {
  console.log('Record only mode: ', justchat);

  const classes = useStyles();

  const { user: firebaseUser } = useUser();

  const [username, setUsername] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [resumeList, setResumeList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [resumedRoom, setResumedRoom] = useState(null);
  const [isResumed, setIsResumed] = useState(false);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { setCurActiveStep } = useActiveStepValue();
  const { pins } = usePinsValue();
  const { setMediaDuration, setMediaUrl } = useSessionValue();

  const history = useHistory();

  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        let _usersList = [];
        let _resumeList = [];
        querySnapshot.forEach(snapshot => {
          const _id = snapshot.id; // 10a
          const _data = snapshot.data(); // {curSession, lastActiveTime, step, userID}
          // console.log('snapshot data: ', _data);
          if (_id.match(/^\d/) && _data.curSession.length > 0) {
            // check if finished
            let timeDiffMinutes = 100;
            if (_data.lastActiveTime) {
              const date = new Date();
              const lastActiveTime = new Date(_data.lastActiveTime).getTime();
              timeDiffMinutes = (date.getTime() - lastActiveTime) / (1000 * 60);
            }
            if (timeDiffMinutes <= 60 && _data.step > 0) {
              _resumeList.push({ id: _id, ..._data });
            } else {
              _usersList.push({ id: _id, ..._data });
            }

            // let _roomId = _id.match(/\d/g).join('');
          }
        });
        // console.log(_usersList);
        // console.log(_resumeList);
        setUsersList(_usersList);
        setResumeList(_resumeList);
      });
  }, []);

  const setUser = async () => {
    console.log('username', username); // firebase user id _ 10a
    let user_id = username.split('_').pop();
    console.log('user_id', user_id); // '10a'
    dispatch(setUserRoom(user_id));

    let newDoc = await firebase.firestore().collection('sessions_by_usernames').doc(username);

    newDoc.get().then(doc => {
      if (!doc.exists) {
        newDoc.set({
          firebaseUser: firebaseUser !== null ? firebaseUser.uid : null,
        });
      }
    });

    await firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('data: ' + doc.data());
          return doc.data();
        } else {
          console.log("User doesn't exist.");
        }
      })
      .then(data => {
        setStates(data);
      });
  };

  const setStates = async data => {
    console.log(data);
    const tempUserId = data.userID;
    const tempSessionID = data.curSession;

    const document = firebase.firestore().collection('sessions').doc(tempSessionID);

    // to clean up data from last session
    await document
      .collection('pins')
      .get()
      .then(doc => doc.forEach(pin => pin.ref.delete()));

    await document.get().then(async doc => {
      if (doc.exists) {
        if (doc.data().caller_id == tempUserId) {
          dispatch(setUserMode('caller'));
          let document_copy = firebase
            .firestore()
            .collection('sessions_by_usernames')
            .doc(username)
            .collection('sessions')
            .doc();
          let new_id = document_copy.id;
          await document_copy.set(doc.data());

          let date = new Date();
          await document.update({
            caller_name: username,
            datacopy_id: new_id,
            date: date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US'),
          });
        } else {
          dispatch(setUserMode('callee'));
          await document.update({ callee_name: username });
        }
      } else {
        console.log("session doesn't exist.");
      }
    });

    //const tempUserMode = data.userMode;
    dispatch(setUserID(tempUserId));
    dispatch(setSessionID(tempSessionID));
    dispatch(setRecordOnly(justchat === true));
    //dispatch(setUserMode(tempUserMode));
    history.push('/content');
  };

  const setResume = async () => {
    console.log('username', username); // firebase user id _ 10a
    let user_id = username.split('_').pop();
    console.log('user_id', user_id); // '10a'
    dispatch(setUserRoom(user_id));

    await firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('data: ' + doc.data());
          return doc.data();
        } else {
          console.log("User doesn't exist.");
        }
      })
      .then(async data => {
        console.log(data.step);

        const tempUserId = data.userID;
        const tempSessionID = data.curSession;

        pins.splice(0, pins.length);
        console.log(pins);

        const doc = firebase.firestore().collection('sessions').doc(tempSessionID);
        const [pinsSnapshot, docSnapshot] = await Promise.all([doc.collection('pins').get(), doc.get()]);

        pinsSnapshot.docs.map(doc => {
          pins.push(doc.data());
        });
        pins.sort((a, b) => a.pinTime - b.pinTime);

        setMediaUrl(docSnapshot.data().archiveData.url);
        setMediaDuration(docSnapshot.data().archiveData.duration);
        if (docSnapshot.data().caller_id == tempUserId) dispatch(setUserMode('caller'));
        else dispatch(setUserMode('callee'));

        // await firebase
        //   .firestore()
        //   .collection('sessions')
        //   .doc(tempSessionID)
        //   .collection('pins')
        //   .get()
        //   .then(snapshot => {
        //     snapshot.docs.map(doc => {
        //       pins.push(doc.data());
        //     });
        //     pins.sort((a, b) => a.pinTime - b.pinTime);
        //   })
        //   .then(() => {
        //     setCurActiveStep(data.step);
        //   })
        //   .catch(err => console.error('Error in loadPins functions: ', err));

        dispatch(setUserID(tempUserId));
        dispatch(setSessionID(tempSessionID));
        dispatch(setRecordOnly(justchat === true));

        setCurActiveStep(data.step);
        history.push('/content');
      });
  };

  const tutorialSection = ({ text, image, alt }, index) => {
    const isTextLeft = index % 2 === 0;
    const textGrid = (
      <Grid key={index} item xs={6} className={classes.tutorial_grid}>
        <Typography
          variant="h2"
          className={isTextLeft ? classes.tutorial_text_left : classes.tutorial_text}
          style={{
            width: index === 0 ? '95%' : '84%',
          }}
        >
          {text}
        </Typography>
      </Grid>
    );

    const imgGrid = (
      <Grid item xs={6} className={classes.tutorial_grid}>
        <img
          src={image}
          alt={alt}
          style={{
            width: index === 0 ? '30%' : '90%',
            marginLeft: index === 0 ? '100px' : '0',
          }}
        />
      </Grid>
    );

    return (
      <Grid
        key={`tutorial-part-${index}`}
        container
        className={isTextLeft ? classes.tutorial_even : classes.tutorial_odd}
      >
        {isTextLeft ? textGrid : imgGrid}
        {isTextLeft ? imgGrid : textGrid}
      </Grid>
    );
  };

  return (
    <section>
      <Navbar />

      {/* <Container className={classes.welcome_container} maxWidth="md">
        <Typography variant="h1" className={classes.welcome_intro}>
          Welcome to Pin-MI
        </Typography>
        <Typography variant="h3" className={classes.welcome_definition}>
          a platform for practicing MI with your peers and the help of pins
        </Typography>
        <br />
      </Container> */}
      {justchat !== true && <>{tutorialInfo.map(tutorialSection)}</>}

      <Container className={classes.welcome_container} maxWidth="md">
        {firebaseUser && (
          <div>
            <Box m={1} display="inline" style={{ fontFamily: 'Lato' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Start a new session:</div>
              <Select
                value={selectedRoom}
                onChange={e => {
                  console.log(e);
                  setSelectedRoom(e);
                  setUsername(`${firebaseUser.uid}_${e.value}`);
                }}
                options={usersList.map(user => {
                  const roomId = user.id;
                  const role = roomId[roomId.length - 1];
                  const roomNumber = roomId.substring(0, roomId.length - 1);
                  return { value: roomId, label: `Room ${roomNumber}: ${role === 'a' ? 'therapist' : 'client'}` };
                })}
              />
            </Box>
          </div>
        )}
        {!firebaseUser && (
          <Box m={1} display="inline">
            <ColorLibTextField
              id="outlined-basic"
              label="Your Unique ID"
              variant="outlined"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
            />
          </Box>
        )}

        <div className={classes.button_wrapper} style={{ paddingBottom: '0px' }}>
          <ColorLibButton
            variant="contained"
            size="large"
            onClick={setUser}
            disabled={firebaseUser !== null && selectedRoom === null}
          >
            Let's get started!
          </ColorLibButton>
        </div>

        {firebaseUser && (
          <div>
            <Box m={1} display="inline" style={{ fontFamily: 'Lato' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Resume a session:</div>
              <Select
                value={resumedRoom}
                onChange={e => {
                  console.log(e);
                  setResumedRoom(e);
                  setUsername(`${firebaseUser.uid}_${e.value}`);
                }}
                options={resumeList.map(user => {
                  const roomId = user.id;
                  const role = roomId[roomId.length - 1];
                  const roomNumber = roomId.substring(0, roomId.length - 1);
                  return { value: roomId, label: `Room ${roomNumber}: ${role === 'a' ? 'therapist' : 'client'}` };
                })}
              />
            </Box>
          </div>
        )}
        <div className={classes.button_wrapper} style={{ paddingBottom: '80px' }}>
          <ColorLibButton
            variant="contained"
            size="large"
            onClick={setResume}
            disabled={firebaseUser !== null && resumedRoom === null}
          >
            Resume session
          </ColorLibButton>
        </div>
      </Container>
    </section>
  );
};

export default Landing;
