import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Box, Container, Grid } from '@material-ui/core';
import { Fragment } from 'react';
import { useActiveStepValue } from '../../context';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import ColorLibToggleButton, { ColorLibToggleButtonGroup } from './ColorLibComponents/ColorLibToggleButton';
import ColorLibPaper from './ColorLibComponents/ColorLibPaper';
import Typography from '@material-ui/core/Typography';

import { firebase } from "../../hooks/firebase";
import SinglePlayerToggleButton, {
SinglePlayerToggleButtonGroup,
} from "./SinglePlayerComponents/SinglePlayerToggleButton";
import { usePlayerModeValue } from "../../context";


const Refresher = () => {
  
  const { setCurActiveStep: setActiveStep } = useActiveStepValue();
  // const { sessionID } = useSessionValue();
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState(['', '', '', '']);
  const [question1Ans, setQuestion1Ans] = useState('');
  const [question2Ans, setQuestion2Ans] = useState('');
  const [openEndedQuesAns, setOpenEndedQuesAns] = useState(['', '', '', '']);

  const [countDown, setCountDown] = useState(10 * 60);

  const user = useSelector(state => state.user);
  const session = useSelector(state => state.session);
  const { playerMode, setPlayerMode } = usePlayerModeValue();

  useEffect(() => {
    // Scroll on render
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    // Scroll to up when the answers are submitted.
    window.scrollTo(0, 0)
  }, [submitted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountDown(countDown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleUserMode = (event, newMode) => {
    console.log(user.userID);
    console.log(user.userMode);
    // const caller = 'tI2fK1Py7Ibsznp3MDz4';
    // const callee = '6AT1Se8aU93MPGXZ5miK';
    // if (newMode !== null) {
    //   dispatch(setUserMode(newMode));
    //   if (newMode == 'caller') {
    //     dispatch(setUserID(caller));
    //   } else {
    //     dispatch(setUserID(callee));
    //   }
    // }
  };

  const handlePlayerMode = (event, newMode) => {
    if (newMode !== null) {
      setPlayerMode(newMode);
    }
  };

  const handleQuestion1 = (event, newAns) => {
    if (newAns !== null) {
      setQuestion1Ans(newAns);
    }
  };

  const handleQuestion2 = (event, newAns) => {
    if (newAns !== null) {
      setQuestion2Ans(newAns);
    }
  };

  const handleOpenEndedQues = (answer, index) => {
    let newAnswers = [...openEndedQuesAns];
    newAnswers[index] = answer;
    setOpenEndedQuesAns(newAnswers);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  

  const makeRefresherDoc = async () => {
    await firebase.firestore().collection("refresher").doc(session.sessionID).collection("users").doc(user.userID).set({
      q1: openEndedQuesAns[0],
      q2: openEndedQuesAns[1],
      q3: openEndedQuesAns[2],
      q4: openEndedQuesAns[3],
      tf1: question1Ans,
      tf2: question2Ans
    })
    .then(() => {
      console.log("Refresher answers submitted.")
    });
  }

  const fetchCurAnswers = async () => {
    const docRef = await firebase.firestore().collection("refresher").doc(session.sessionID).collection("users").doc(user.userID);
    const curAnswers = 
      await docRef.get().then((doc) => {
        if (doc.exists) {
          return [doc.data()['q1'], doc.data()['q2'], doc.data()['q3'], doc.data()['q4']];
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      })
    if (curAnswers) {
      setSubmittedAnswers(curAnswers);
    }
  }

  const handleSubmit = async () => {
    //makeSessionDoc();
    makeRefresherDoc();
    setSubmitted(true);
    fetchCurAnswers();
  }

  /* TODO: The 'submittedResponse's are just placeholders for now.
   * After the database is set up, then should be replaced with what was sent to the database. */
  const openEndedQuestions = [
    {
      question: "Are you doing OK today?",
      description: "Convert the closed question to open-ended...",
      submittedResponse: "How is your day going?",
      sampleResponse: "What has been good in your day so far?",
    },
    {
      question: "How much do you drink on a typical drinking occasion?",
      description: "Convert the closed question to open-ended...",
      submittedResponse: "Do you drink occasionally?",
      sampleResponse: "What's a typical drinking occasion like for you?",
    },
    {
      question: "I don't get what we're supposed to be doing here.",
      description: "Form a question in response to the client statement...",
      submittedResponse: "Do you understand why I am asking you these questions?",
      sampleResponse: "What's your understanding of why you are here?",
    },
    {
      question: "I love my kids, but sometimes they push me to the edge, and then I do things I shouldn't.",
      description: "Form a question in response to the client statement...",
      submittedResponse: "Would you like me to help you with some coping skills?",
      sampleResponse: "What are the feelings like after one of these episodes when you've felt pushed and then reacted in a way you didn't like?",
    }
  ]

  const getOpenEndQuestionSet = (question, index, submitted) => {
    let response = <div />;
    if (!submitted) {
      response = (
        <ColorLibTextField
          id="outlined-secondary"
          label={question.description}
          fullWidth
          variant="outlined"
          multiline
          maxRows={2}
          margin="normal"
          value={openEndedQuesAns[index]}
          onChange={event => handleOpenEndedQues(event.target.value, index)}
        />
      );
    } else {
      response = (
        <Grid
          container
          direction="row"
          style={{
            alignItems: 'stretch',
            margin: '16px 0px 26px 0px',
          }}
        >
          <Grid item xs={6}>
            <ColorLibPaper
              elevation={9}
              style={{
                height: 'calc(100% - 16px)',
                marginRight: '17px',
              }}
            >
              <Typography variant="subtitle2">
                Your Response
              </Typography>
              <Typography variant="body2">
                {submittedAnswers[index]}
              </Typography>
            </ColorLibPaper>
          </Grid>
          <Grid item xs={6}>
            <ColorLibPaper
              elevation={9}
              style={{
                height: 'calc(100% - 16px)',
                marginLeft: '17px',
              }}
            >
              <Typography variant="subtitle2">
                Sample Response
              </Typography>
              <Typography variant="body2">
                {question.sampleResponse}
              </Typography>
            </ColorLibPaper>
          </Grid>
        </Grid>
      )
    }
    return (
      <Fragment key={`open-ended-${index}`}>
        <Typography variant='body1' style={{ marginTop: '10px' }}>
          {question.question}
        </Typography>
        {response}
      </Fragment>
    )
  }

  const checkValidness = (question1Ans, question2Ans) => !(
    question1Ans === '' || question2Ans === ''
  );

  const getButton = (submitted, isValid) => {
    if (submitted) {
      return (
        <ColorLibButton
          variant='contained'
          size='medium'
          onClick={handleNext}
        >
          Prepare for Live Session
        </ColorLibButton>
      );
    } else {
      return (
        <ColorLibButton
          size='medium'
          variant={!isValid ? 'outlined' : 'contained'}
          disabled={!isValid ? true : false}
          onClick={handleSubmit}
        >
          Submit
        </ColorLibButton>
      );
    }
  };

  return (
    <Fragment>
      <Container maxWidth='md'>
        <Box align="left" m={2}>
          <SinglePlayerToggleButtonGroup
            value={playerMode}
            exclusive
            onChange={handlePlayerMode}
          >
            <SinglePlayerToggleButton size="small" value="multiplayer" onChange={handlePlayerMode}>
              Multiplayer
            </SinglePlayerToggleButton>
            <SinglePlayerToggleButton size="small" value="singleplayer">
              Single-player
            </SinglePlayerToggleButton>
          </SinglePlayerToggleButtonGroup>
          <ColorLibToggleButtonGroup
            value={user.userMode}
            exclusive
            onChange={handleUserMode}
            disabled={submitted}
          >
            <ColorLibToggleButton size="small" value="caller">
              Caller
            </ColorLibToggleButton>
            <ColorLibToggleButton size="small" value="callee">
              Callee
            </ColorLibToggleButton>
          </ColorLibToggleButtonGroup>
        </Box>
        <Typography variant='h2'>
          {submitted
            ? "Complete the exercises to unlock today’s session!"
            : "Review the following before we begin the practice session."}
        </Typography>
        <Grid container style={{ marginTop: '20px' }}>
          <Grid item xs={9}>
            <Typography variant='body1' style={{ marginRight: '12px' }}>
              Closed questions are bad.
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <ColorLibToggleButtonGroup
              value={question1Ans}
              exclusive
              onChange={handleQuestion1}
            >
              <ColorLibToggleButton size="small" value="true" disabled={submitted}>
                True
              </ColorLibToggleButton>
              <ColorLibToggleButton size="small" value="false" disabled={submitted}>
                False
              </ColorLibToggleButton>
            </ColorLibToggleButtonGroup>
          </Grid>
          {!submitted ? null :
            <ColorLibPaper elevation={9} style={{ margin: '15px 0px' }}>
              <Typography variant="body2">
                {question1Ans === "false" ? "Correct!" : "Sorry, try again."} Closed questions are not “bad.” They simply are limited as a tool, so we try to avoid using them in favor of open-ended questions. However, there are situations in which closed questions are desirable. In general, the aim is to ask more open-ended than closed questions.
              </Typography>
            </ColorLibPaper>
          }
        </Grid>
        <Grid container style={{ marginTop: '20px' }}>
          <Grid item xs={9}>
            <Typography variant='body1' style={{ marginRight: '12px' }}>
              We use reflections to help clients not only see what they've told us, but to also help organize and understand their experience.
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <ColorLibToggleButtonGroup
              value={question2Ans}
              exclusive
              onChange={handleQuestion2}
            >
              <ColorLibToggleButton size="small" value="true" disabled={submitted}>
                True
              </ColorLibToggleButton>
              <ColorLibToggleButton size="small" value="false" disabled={submitted}>
                False
              </ColorLibToggleButton>
            </ColorLibToggleButtonGroup>
          </Grid>
          {!submitted ? null :
            <ColorLibPaper elevation={9} style={{ margin: '15px 0px' }}>
              <Typography variant="body2">
                {question2Ans === "true" ? "Correct!" : "Sorry, try again."} If we simply hold up the mirror, then we aren’t helping clients become unstuck. In addition to helping clients hear again what they’re told us, we also selectively attend to certain elements and not to others and then present that information back in a manner that helps them attain greater understanding of their situation
              </Typography>
            </ColorLibPaper>}
        </Grid>
        <Typography variant='h4' style={{ marginTop: '50px' }}>
          Practicing Open-ended Questions
        </Typography>
        {openEndedQuestions.map((ques, index) => getOpenEndQuestionSet(ques, index, submitted))}
      </Container>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '50px 0px' }}>
        {getButton(
          submitted,
          checkValidness(question1Ans, question2Ans)
        )}
      </div>

    </Fragment>
  );
}

export default Refresher;