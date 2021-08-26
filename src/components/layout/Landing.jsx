import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Navbar from './Navbar';

const useStyles = makeStyles((theme) => ({
  welcome_container: {
    padding: "50px 68px 50px 68px",
    textAlign: "center",
  },
  welcome_intro: {
    color: theme.palette.teal.dark,
    fontSize: "xx-large",
    fontWeight: "bold",
  },
  welcome_definition: {
    color: theme.palette.gray.main,
    fontStyle: "italic",
    padding: "10px 20px 10px 20px",
  },
  startbutton: {
    borderRadius: "35px",
    backgroundColor: theme.palette.teal.main,
    color: "white",
    fontSize: "large",
    padding: "5px 36px 5px 36px",
    textTransform: "none",
    '&:hover': {
      backgroundColor: theme.palette.teal.lighter,
      color: theme.palette.gray.dark,
    }, 
  }
}));

const Landing = () => {
  const classes = useStyles();

	return (
		<section> 
			<Navbar />
			<Container className={classes.welcome_container} maxWidth="md">
        <Typography className={classes.welcome_intro}>
          Pin-MI is a platform for practicing MI with your peers with the help of pins.
        </Typography>
        <Typography className={classes.welcome_definition}>
          Pins are time marks that you add during your live role-play session to mark parts of conversation that you would like to revisit during a feedback conversation.
        </Typography>
				<Button className={classes.startbutton} href="/content">
          Let's get started!
        </Button>
			</Container>
		</section>
	);
};

export default Landing;

