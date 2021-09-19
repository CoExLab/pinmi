import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ColorLibButton from './ColorLibComponents/ColorLibButton';
import Navbar from './Navbar';
import { TextField, Box } from '@material-ui/core';


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
}));

const Landing = () => {
  const classes = useStyles();

	return (
		<section> 
			<Navbar />
			<Container className={classes.welcome_container} maxWidth='md'>
        <Typography variant='h1' className={classes.welcome_intro}>
          Pin-MI is a platform for practicing MI with your peers with the help of pins.
        </Typography>
        <Typography variant='h3' className={classes.welcome_definition}>
          Pins are time marks that you add during your live role-play session to mark parts of conversation that you would like to revisit during a feedback conversation.
        </Typography>
        <br />
        <Box m={1} display="inline">
        <TextField id="outlined-basic" label="Your Name" variant="outlined" />
        </Box>
        <Box m={1} display="inline">
        <TextField id="outlined-basic" label="Room Name" variant="outlined" />
				</Box>
        <Box m={2}>
        <ColorLibButton variant='contained' size='large' href='/content'>
          Let's get started!
        </ColorLibButton>
        </Box>
			</Container>
		</section>
	);
};

export default Landing;

