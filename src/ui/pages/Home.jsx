import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Navbar from '../components/Navbar';

import pinningPreview from './../../other/tutorial/pinning-preview.gif';
import modal from './../../other/tutorial/modal.png';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BarChartIcon from '@material-ui/icons/BarChart';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';

import imgBK from '../../assets/images/team_BK.jpeg';
import imgLD from '../../assets/images/team_LD.jpeg';
import imgTC from '../../assets/images/team_TC.jpeg';
import imgED from '../../assets/images/team_ED.jpeg';
import imgYC from '../../assets/images/team_YC.jpeg';
import imgML from '../../assets/images/team_ML.jpeg';
import imgMA from '../../assets/images/team_MA.jpeg';
import imgAN from '../../assets/images/team_AN.jpeg';
import imgJL from '../../assets/images/team_JL.jpeg';

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
    padding: '50px 65px',
    background: theme.palette.teal.lighter + ' 50%',
  },
  tutorial_odd: {
    padding: '50px 65px',
    background: 'white',
  },
  tutorial_grid: {
    alignSelf: 'center',
  },
  tutorial_text: {
    // textAlign: "center",
  },
  tutorial_text_left: {
    marginRight: 0,
    marginLeft: 'auto',
    textAlign: 'center',
  },
  text_icon: {
    display: 'flex',
  },
  text_highlight: {
    fontWeight: 'bolder',
    textDecoration: 'underline',
  },
  text_header: {
    color: theme.palette.teal.dark,
  },
  page_link: {
    fontWeight: 'bolder',
    textDecoration: 'underline',
    color: theme.palette.pink.dark,
    '&:hover': {
      color: theme.palette.pink.light,
    },
  },
  text_link: {
    color: theme.palette.teal.dark,
  },
  icon: {
    fontSize: '40px',
    padding: '10px 20px',
    color: theme.palette.teal.dark,
  },
  team: {
    paddingTop: '50px',
    width: '30%',
    textAlign: 'center',
    // display: "inline-flex",
  },
  team_container: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: '0 0 30%',
    justifyContent: 'center',
  },
}));

const teamMembers = [
  { name: 'Laura Dabbish', email: 'dabbish@andrew.cmu.edu', image: imgLD, past: false },
  { name: 'Bob Kraut', email: 'robert.kraut@cmu.edu', image: imgBK, past: false },
  { name: 'Tiangying Chen', email: 'tianyinc@andrew.cmu.edu', image: imgTC, past: false },
  { name: 'Michael Xieyang Liu', email: 'xieyangl@cs.cmu.edu ', image: imgML, past: false },
  { name: 'Alice (Fei) Nie', email: 'fnie@andrew.cmu.edu ', image: imgAN, past: false },
  { name: 'Leo (Junyi) Liu', email: 'junyili2@andrew.cmu.edu ', image: imgJL, past: false },
  { name: 'Emily Ding', email: 'eding@andrew.cmu.edu', image: imgED, past: true },
  { name: 'Mansi Agarwal', email: 'mragarwa@andrew.cmu.edu ', image: imgMA, past: true },
  { name: 'Yo-Lei Chen', email: 'yoleic@andrew.cmu.edu', image: imgYC, past: true },
];

// Home and Research page
const Home = () => {
  const classes = useStyles();

  const tutorialInfo = [
    {
      header: 'Our Mission',
      text: (
        <>
          <p>
            We are developing an interactive tool for{' '}
            <span className={classes.text_highlight}>motivational interviewing</span> training using a human-centered
            design approach. Motivational Interviewing (MI) is an effective therapeutic technique to support behavior
            change, but training is often <span className={classes.text_highlight}>time consuming</span> and its{' '}
            <span className={classes.text_highlight}> effectiveness diminishes over time </span>.
          </p>
          <p>The motivation of this project is to address:</p>
          <div className={classes.text_icon}>
            <AccountCircleIcon className={classes.icon} />

            <p>Untrained medical practitioners may struggle with the skills that MI aims to use</p>
          </div>
          <div className={classes.text_icon}>
            <BarChartIcon className={classes.icon} />
            <p>Current methods for training MI are time consuming and expensive.</p>
          </div>
          <div className={classes.text_icon}>
            <AccessAlarmsIcon className={classes.icon} />
            <p>The current model is not easily scalable</p>
          </div>
        </>
      ),
    },
    {
      header: 'The Work so Far',
      text: (
        <>
          <h1 className={classes.text_header}>Research</h1>
          <p>
            <a href="https://dl.acm.org/doi/pdf/10.1145/3479510" className={classes.text_link}>
              Scaffolding the Online Peer-support Experience: Novice Supporters' Strategies and Challenges
            </a>
          </p>
          <p>
            <a href="https://dl.acm.org/doi/pdf/10.1145/3544548.3581551" className={classes.text_link}>
              Facilitating Counselor Reflective Learning with a Real-time Annotation tool
            </a>
          </p>
        </>
      ),
      alt: 'Discussion Interface',
    },
    {
      header: 'People',
      text: (
        <>
          <p>
            We are unique combination of faculty members, post-graduate researchers, and graduate and undergraduate
            students from human-computer interaction, computer science, cognitive science, and ..... to make up an
            interdisciplinary research team.
          </p>
          <br />
        </>
      ),
      alt: 'Self-Reflection Prep Interface',
    },
    {
      header: '',
      text: (
        <>
          <div className={classes.team_container}>
            {teamMembers
              .filter(member => !member.past)
              .map((member, idx) => (
                <div key={idx} className={classes.team}>
                  <div style={{ alignItems: 'center' }}>
                    <img
                      src={member.image}
                      style={{
                        width: '150px',
                        height: '150px',
                        // marginRight: "50px",
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div>
                    <h1>{member.name}</h1>
                    <p>{member.email}</p>
                  </div>
                </div>
              ))}
          </div>
          <br />
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Past members</h1>
          <div className={classes.team_container}>
            {teamMembers
              .filter(member => member.past)
              .map((member, idx) => (
                <div key={idx} className={classes.team}>
                  <div style={{ alignItems: 'center' }}>
                    <img
                      src={member.image}
                      style={{
                        width: '120px',
                        height: '120px',
                        // marginRight: "50px",
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div style={{ transform: 'scale(80%)' }}>
                    <h1>{member.name}</h1>
                    <p>{member.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      ),
    },
    // {
    //   header: 'The Work so Far',
    //   text: (
    //     <>
    //       <h1 className={classes.text_header}>Research</h1>
    //       <p>
    //         <a href="https://dl.acm.org/doi/pdf/10.1145/3479510" className={classes.text_link}>
    //           Scaffolding the Online Peer-support Experience: Novice Supporters' Strategies and Challenges
    //         </a>
    //       </p>
    //       <p>
    //         <a href="https://dl.acm.org/doi/pdf/10.1145/3544548.3581551" className={classes.text_link}>
    //           Facilitating Counselor Reflective Learning with a Real-time Annotation tool
    //         </a>
    //       </p>
    //     </>
    //   ),
    //   alt: 'Discussion Interface',
    // },
    {
      header: 'Get Involved',
      text: (
        <>
          <p>Interested in joining our team or learning more about our work? Get in touch!</p>
          <p>
            Tianying Chen
            <br />
            <a href="mailto:tianyinc@andrew.cmu.edu" className={classes.text_link}>
              tianyinc@andrew.cmu.edu
            </a>
          </p>
        </>
      ),
      alt: 'Discussion Interface',
    },
  ];

  const tutorialSection = ({ header, image, text }, index) => {
    // console.log(image);
    const sectionCounter = index % 2 === 0;
    const leftTextGrid = (
      <Grid item xs={6} className={classes.tutorial_grid}>
        <Typography
          variant="h1"
          className={classes.tutorial_text_left}
          style={{
            width: '95%',
          }}
        >
          {header}
        </Typography>
        {image && (
          <Grid item xs={6} className={classes.tutorial_grid}>
            <img
              src={image}
              style={{
                width: '50%',
                paddingTop: '100px',
                marginLeft: '80%',
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
          component={'div'}
          className={classes.tutorial_text}
          style={{
            width: '95%',
            lineHeight: '2',
          }}
        >
          {text}
        </Typography>
      </Grid>
    );

    return index !== 3 ? (
      <Grid
        key={`tutorial-part-${index}`}
        container
        className={sectionCounter ? classes.tutorial_even : classes.tutorial_odd}
      >
        {leftTextGrid}
        {rightTextGrid}
      </Grid>
    ) : (
      <div
        key={`tutorial-part-${index}`}
        // container
        className={sectionCounter ? classes.tutorial_even : classes.tutorial_odd}
      >
        <Typography variant="body2" component={'div'} className={classes.tutorial_text}>
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
          Pin-Mi: A Platform for Training Motivational Interviewing
        </Typography>
        <Grid item xs={6} className={classes.tutorial_grid}>
          <img
            src={modal}
            alt={'Role-playing session modal'}
            style={{
              width: '120%',
              marginTop: '20px',
              marginLeft: '40%',
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
