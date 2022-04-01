import { useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { firebase } from "../../hooks/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ColorLibButton from "./ColorLibComponents/ColorLibButton";
import ColorLibTextField from "./ColorLibComponents/ColorLibTextField";
import Navbar from "./Navbar";

import pinningPreview from "./../../other/tutorial/pinning-preview.gif";
import modal from "./../../other/tutorial/modal.png";
import discussionPrepPreview from "./../../other/tutorial/discussionPrepPreview.png";
import discussionPreview from "./../../other/tutorial/discussionPreview.png";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BarChartIcon from "@material-ui/icons/BarChart";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";

import { setUserID, setUserMode, setSessionID } from "../Store";

import imgBK from "../../other/team_BK.jpeg";
import imgLD from "../../other/team_LD.jpeg";
import imgTC from "../../other/team_TC.jpeg";
import imgED from "../../other/team_ED.JPG";
import imgYC from "../../other/team_YC.jpeg";
import imgMA from "../../other/team_MA.jpeg";

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
  tutorial_even: {
    padding: "50px 65px",
    background: theme.palette.teal.lighter + " 50%",
  },
  tutorial_odd: {
    padding: "50px 65px",
    background: "white",
  },
  tutorial_grid: {
    alignSelf: "center",
  },
  tutorial_text: {
    // textAlign: "center",
  },
  tutorial_text_left: {
    marginRight: 0,
    marginLeft: "auto",
    textAlign: "center",
  },
  text_icon: {
    display: "flex",
  },
  text_highlight: {
    fontWeight: "bolder",
    textDecoration: "underline",
  },
  text_header: {
    color: theme.palette.teal.dark,
  },
  page_link: {
    fontWeight: "bolder",
    textDecoration: "underline",
    color: theme.palette.pink.dark,
    "&:hover": {
      color: theme.palette.pink.light,
    },
  },
  text_link: {
    color: theme.palette.teal.dark,
  },
  icon: {
    fontSize: "40px",
    padding: "10px 20px",
    color: theme.palette.teal.dark,
  },
  team: {
    paddingTop: "50px",
    width: "30%",
    textAlign: "center"
    // display: "inline-flex",
  },
  team_container: {
    display: "flex",
    flexWrap: "wrap",
    flex: "0 0 30%",
    justifyContent: "center",
  },
}));

const teamMembers = [
  { name: "Laura Dabbish", email: "dabbish@andrew.cmu.edu", image: imgLD },
  { name: "Bob Kraut", email: "robert.kraut@cmu.edu", image: imgBK },
  { name: "Tiangying Chen", email: "tianyinc@andrew.cmu.edu", image: imgTC },
  { name: "Emily Ding", email: "eding@andrew.cmu.edu", image: imgED },
  { name: "Mansi Agarwal", email: "mragarwa@andrew.cmu.edu ", image: imgMA },
  { name: "Yo-Lei Chen", email: "yoleic@andrew.cmu.edu", image: imgYC },
];

const Home = () => {
  const classes = useStyles();

  const tutorialInfo = [
    {
      header: "Our Mission",
      text: (
        <>
          <p>
            We are developing an interactive tool for{" "}
            <span className={classes.text_highlight}>
              motivational interviewing
            </span>{" "}
            training using a human-centered design approach. Motivational
            Interviewing (MI) is an effective therapeutic technique to support
            behavior change, but training is often{" "}
            <span className={classes.text_highlight}>time consuming</span> and
            its{" "}
            <span className={classes.text_highlight}>
              {" "}
              effectiveness diminishes over time{" "}
            </span>
            .
          </p>
          <p>The motivation of this project is to address:</p>
          <div className={classes.text_icon}>
            <AccountCircleIcon className={classes.icon} />

            <p>
              Untrained medical practitioners may struggle with the skills that
              MI aims to use
            </p>
          </div>
          <div className={classes.text_icon}>
            <BarChartIcon className={classes.icon} />
            <p>
              Current methods for training MI are time consuming and expensive.
            </p>
          </div>
          <div className={classes.text_icon}>
            <AccessAlarmsIcon className={classes.icon} />
            <p>The current model is not easily scalable</p>
          </div>
        </>
      ),
    },
    {
      header: "Project",
      image: pinningPreview,
      text: (
        <>
          <h1 className={classes.text_header}>Problem Space</h1>
          <p>
            <span className={classes.text_highlight}>
              Minimally trained healthcare practitioners struggle
            </span>{" "}
            with:
            <ul>
              <li>building rapport</li>
              <li>analyzing the problem</li>
              <li>provoking commitment</li>
              <li>instilling sel-efficacy</li>
            </ul>
          </p>
          <h1 className={classes.text_header}>Our Project Goal</h1>
          <p>
            Improve the{" "}
            <span className={classes.text_highlight}>
              quality and efficiency
            </span>{" "}
            of Motivational Interviewing Training
          </p>
          <h1 className={classes.text_header}>Duration</h1>
          <p>Feb 2021 - Present (1 year)</p>
          <br />
          <a href="/" className={classes.page_link}>
            <h1>
              View Our Project <span>&#8594;</span>
            </h1>
          </a>
        </>
      ),
    },
    {
      header: "People",
      text: (
        <>
          <p>
            We are unique combination of faculty members, post-graduate
            researchers, and graduate and undergraduate students from
            human-computer interaction, computer science, cognitive science, and
            ..... to make up an interdisciplinary research team.
          </p>
          <br />
        </>
      ),
      alt: "Discussion Prep Interface",
    },
    {
      header: "",
      text: (
        <div className={classes.team_container}>
          {teamMembers.map((i) => (
            <div className={classes.team}>
              <div style={{ alignItems: "center" }}>
                <img
                  src={i.image}
                  style={{
                    width: "200px",
                    height: "200px",
                    // marginRight: "50px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div>
                <h1>{i.name}</h1>
                <p>{i.email}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "The Work so Far",
      text: (
        <>
          <h1 className={classes.text_header}>Research</h1>
          <p>
            <a
              href="https://drive.google.com/file/d/1nCFw9ovufjExgBBN1iuxRkvWWhP2jaK6/view?usp=sharing"
              className={classes.text_link}
            >
              Novice challenges with MI
            </a>
          </p>
        </>
      ),
      alt: "Discussion Interface",
    },
    {
      header: "Get Involved",
      text: (
        <>
          <p>
            Interested in joining our team or learning more about our work? Get
            in touch!
          </p>
          <p>
            Tianying Chen
            <br />
            <a
              href="mailto:tianyinc@andrew.cmu.edu"
              className={classes.text_link}
            >
              tianyinc@andrew.cmu.edu
            </a>
          </p>
        </>
      ),
      alt: "Discussion Interface",
    },
  ];

  const [username, setUsername] = useState("");
  const usernameRef = useRef("");

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const history = useHistory();

  const setUser = async () => {
    console.log(username);

    await firebase
      .firestore()
      .collection("users")
      .doc(username)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("data: " + doc.data().userID);
          return doc.data();
        } else {
          console.log("User doesn't exist.");
        }
      })
      .then((data) => {
        setStates(data);
      });
  };

  const setStates = async (data) => {
    const tempUserId = data.userID;
    const tempSessionID = data.curSession;
    await firebase
      .firestore()
      .collection("sessions")
      .doc(tempSessionID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().caller_id == tempUserId) {
            dispatch(setUserMode("caller"));
          } else {
            dispatch(setUserMode("callee"));
          }
        } else {
          console.log("session doesn't exist.");
        }
      });

    //const tempUserMode = data.userMode;
    dispatch(setUserID(tempUserId));
    dispatch(setSessionID(tempSessionID));
    //dispatch(setUserMode(tempUserMode));
    history.push("/content");
  };

  const tutorialSection = ({ header, image, text }, index) => {
    console.log(image);
    const sectionCounter = index % 2 === 0;
    const leftTextGrid = (
      <Grid item xs={6} className={classes.tutorial_grid}>
        <Typography
          variant="h1"
          className={classes.tutorial_text_left}
          style={{
            width: "95%",
          }}
        >
          {header}
        </Typography>
        {image && (
          <Grid item xs={6} className={classes.tutorial_grid}>
            <img
              src={image}
              style={{
                width: "50%",
                paddingTop: "100px",
                marginLeft: "80%",
              }}
            />
          </Grid>
        )}
      </Grid>
    );

    const rightTextGrid = (
      <Grid item xs={6} className={classes.tutorial_grid}>
        <Typography
          variant="body2"
          className={classes.tutorial_text}
          style={{
            width: "95%",
            lineHeight: "2",
          }}
        >
          {text}
        </Typography>
      </Grid>
    );

    return index != 3 ? (
      <Grid
        key={`tutorial-part-${index}`}
        container
        className={
          sectionCounter ? classes.tutorial_even : classes.tutorial_odd
        }
      >
        {leftTextGrid}
        {rightTextGrid}
      </Grid>
    ) : (
      <div
        key={`tutorial-part-${index}`}
        // container
        className={
          sectionCounter ? classes.tutorial_even : classes.tutorial_odd
        }
      >
        <Typography
          variant="body2"
          className={classes.tutorial_text}
        >
          {text}
        </Typography>
      </div>
    );
  };

  return (
    <section>
      <Navbar />
      <Container className={classes.welcome_container} maxWidth="md">
        <Typography variant="h1" className={classes.welcome_intro}>
          Pin-Mi: A Platform for Training Nurses to Conduct Motivational
          Interviewing
        </Typography>
        <Grid item xs={6} className={classes.tutorial_grid}>
          <img
            src={modal}
            alt={"Role-playing session modal"}
            style={{
              width: "120%",
              marginTop: "20px",
              marginLeft: "40%",
            }}
          />
        </Grid>
        <br />
      </Container>
      {tutorialInfo.map(tutorialSection)}
      <div className={classes.button_wrapper}></div>
    </section>
  );
};

export default Home;
