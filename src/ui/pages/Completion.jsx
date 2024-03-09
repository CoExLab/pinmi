import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ColorLibButton from '../components/colorLibComponents/ColorLibButton';
import { Icon, Fab, CircularProgress } from '@material-ui/core';
import pin from '../../other/images/pin_pink.svg';
import Navbar from '../components/Navbar';

const useStyles = makeStyles(theme => ({
  contentBox: {
    left: 0,
    right: 0,
    bottom: '30px',
    top: '94px',
    position: 'absolute',
    overflow: 'hidden',
  },
  imageIcon: {
    height: '60px',
  },
  iconRoot: {
    textAlign: 'center',
    marginTop: '15px',
    height: '100%',
    width: '60%',
    overflow: 'visible',
  },
  fab: {
    height: '100px',
    width: '100px',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%) !important',
    backgroundColor: 'white !important',
  },
  innerBackground: {
    left: '-15.95%',
    right: '-22.17%',
    top: '-84.3%',
    bottom: '-175.79%',
    position: 'absolute',
    background: 'radial-gradient(69.01% 69.01% at 66.08% 30.99%, rgba(0, 94, 125, 0.1) 0%, #337E92 100%)',
    zIndex: -1,
  },
  innerText: {
    marginTop: '80px',
    textAlign: 'center',
  },
  innerText_title: {
    color: 'white',
    marginTop: '30px',
  },
  innerText_content: {
    color: 'white',
    marginBottom: '20px',
  },
  rescheduleButton: {
    boxShadow: 'none',
  },
}));

// completion page
const Completion = () => {
  const classes = useStyles();
  return (
    <section>
      <Navbar />
      <div className={classes.contentBox}>
        <div className={classes.innerBackground} />
        <Container className={classes.innerText}>
          <Fab aria-label="addPin" className={classes.fab} disabled>
            <Icon classes={{ root: classes.iconRoot }}>
              <img className={classes.imageIcon} src={pin} alt="Pink Pin-mi Icon" />
            </Icon>
          </Fab>
          <br />
          <Typography variant="h1" className={classes.innerText_title}>
            Congratulations!
          </Typography>
          <Typography variant="h2" className={classes.innerText_content}>
            You have successfully finished today’s session in Pin-MI.
          </Typography>
          <br />
          {/* <ColorLibButton className={classes.rescheduleButton} variant="outlined" size="large" href="/Home"> */}
          <ColorLibButton
            className={classes.rescheduleButton}
            variant="outlined"
            size="large"
            href="https://cmu.ca1.qualtrics.com/jfe/form/SV_4GCEbmwDr08iK5U"
          >
            Please finish this survey!
          </ColorLibButton>
        </Container>
      </div>
    </section>
  );
};

export default Completion;
