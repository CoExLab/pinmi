import { useState } from 'react';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";

import { firebase } from '../../hooks/firebase';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import ColorLibNextButton from './ColorLibComponents/ColorLibButton';
import Navbar from './Navbar';

import pinningPreview from './../../other/tutorial/pinning-preview.gif';
import modal from './../../other/tutorial/modal.png';
import discussionPrepPreview from './../../other/tutorial/discussionPrepPreview.png';
import discussionPreview from './../../other/tutorial/discussionPreview.png';

import { setUserID, setUserMode, setSessionID } from '../Store';

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
  }
}));

const tutorialInfo = [{
    text: "Use pins to mark moments of MI strengths and opportunities in a conversation",
    image: pinningPreview,
    alt: "Pinning",
  }, {
    text: "during a practitioner-client role-playing session with a peer",
    image: modal,
    alt: "Role-playing session modal",
  }, {
    text: "and after to reflect on the conversation and prepare for",
    image: discussionPrepPreview,
    alt: "Discussion Prep Interface",
  }, {
    text: "a collaborative discussion with your peer to share thoughts and specific feedback on those pinned moments.",
    image: discussionPreview,
    alt: "Discussion Interface",
  }
];

const Landing = () => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const usernameRef = useRef('');

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const history = useHistory();

  const setUser = async () => {
    console.log(username);

    await firebase.firestore().collection("users").doc(username).get().then((doc) => {
      if (doc.exists) {
        console.log("data: " + doc.data().userID);
        return doc.data();
      } else {
        console.log("User doesn't exist.");
      }
    })
    .then((data) => {
      setStates(data);
    })
  }
  
  const setStates = async (data) => {
    const tempUserId = data.userID;
    const tempSessionID = data.curSession;
    await firebase.firestore().collection("sessions").doc(tempSessionID).get().then((doc) => {
      if (doc.exists) {
        if(doc.data().caller_id == tempUserId) {
          dispatch(setUserMode('caller'));
        } else {
          dispatch(setUserMode('callee'));
        }
      } else {
        console.log("session doesn't exist.");
      }
    })
    
    //const tempUserMode = data.userMode;
    dispatch(setUserID(tempUserId));
    dispatch(setSessionID(tempSessionID));
    //dispatch(setUserMode(tempUserMode));
    history.push("/content");
  }

  const tutorialSection = ({text, image, alt}, index) => {
    const isTextLeft = index % 2 === 0;
    const textGrid = 
      <Grid item xs={6} className={classes.tutorial_grid}>
        <Typography 
          variant='h2' 
          className={
            isTextLeft 
            ? classes.tutorial_text_left
            : classes.tutorial_text 
          }
          style={{
            width: index === 0 ? '95%' : '84%'
          }}
        >
          {text}
        </Typography>
      </Grid>;

    const imgGrid = 
      <Grid item xs={6} className={classes.tutorial_grid}>
        <img src={image} alt={alt} style={{
          width: index===0? '30%':'90%',
          marginLeft: index===0? '100px':'0'
        }}/>
      </Grid>;

    return (
      <Grid 
        key = {`tutorial-part-${index}`}
        container 
        className={
          isTextLeft
          ? classes.tutorial_even 
          : classes.tutorial_odd
        }
      >
        {isTextLeft ? textGrid : imgGrid}
        {isTextLeft ? imgGrid : textGrid}
      </Grid>
    )
  };

	return (
		<section> 
			<Navbar />
			<Container className={classes.welcome_container} maxWidth='md'>
        <Typography variant='h1' className={classes.welcome_intro}>
        Welcome to Pin-MI
        </Typography>
        <Typography variant='h3' className={classes.welcome_definition}>
        a platform for practicing MI with your peers and the help of pins
        </Typography>
        <br />
        
			</Container>
      {tutorialInfo.map(tutorialSection)}
      <Container className={classes.welcome_container} maxWidth='md'>
      <Box m={1} display="inline">
          <ColorLibTextField 
            id="outlined-basic" 
            label="Your Name" 
            variant="outlined" 
            value={username}
            inputRef={usernameRef}
            onChange={() => setUsername(usernameRef.current.value)}
          />
        </Box>
      </Container>
      <div className={classes.button_wrapper}>
        <ColorLibButton variant='contained' size='large' onClick={setUser}>
          Let's get started!
        </ColorLibButton>
      </div>
		</section>
	);
};

export default Landing;

