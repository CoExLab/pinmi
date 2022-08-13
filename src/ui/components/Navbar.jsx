import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Loader from 'react-spinners/BounceLoader';

import ColorLibButton from './colorLibComponents/ColorLibButton';

import { useUser } from '../../contexts/userContext';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.teal.dark,
    flexGrow: 1,
    fontWeight: '600',
  },
  navbar: {
    backgroundColor: 'white',
    border: '1px solid #C2DCE7',
    boxShadow: '0px 0px 0px 0px',
  },
  navbar_button: {
    color: theme.palette.gray.dark,
    fontSize: '16px',
    margin: '0px 13px',
    padding: '6px 17px',
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  const { user } = useUser();

  if (user === undefined) {
    return null;
  }

  return (
    <div>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.icon}>
            Pin-MI
          </Typography>

          <ColorLibButton variant="text" size="small" className={classes.navbar_button} href="/Home">
            Home
          </ColorLibButton>

          <ColorLibButton variant="text" size="small" className={classes.navbar_button} href="/">
            Project
          </ColorLibButton>

          <ColorLibButton variant="text" size="small" className={classes.navbar_button} href="/justchat">
            Chat
          </ColorLibButton>

          <ColorLibButton variant="text" size="small" className={classes.navbar_button} href="/Review">
            Review
          </ColorLibButton>

          {/* <ColorLibButton variant="text" size="small" key="practice" className={classes.navbar_button}>
            Practice
          </ColorLibButton> */}

          <ColorLibButton variant="outlined" size="small" className={classes.navbar_button} href="/auth">
            {user !== null && user !== undefined ? user.email : 'Sign up / Log in'}
          </ColorLibButton>

          {/* <ColorLibButton
            variant="outlined"
            size="small"
            key="message"
            className={classes.navbar_button}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Message
          </ColorLibButton> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
