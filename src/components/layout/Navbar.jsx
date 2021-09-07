import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ColorLibButton from './ColorLibComponents/ColorLibButton';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.teal.dark,
    flexGrow: 1,
    fontWeight: "600",
  },
  navbar: {
    backgroundColor: "white",
    border: "1px solid #C2DCE7",
    boxShadow: "0px 0px 0px 0px",
  },
  navbar_button: {
    color: theme.palette.gray.dark,
    fontSize: "16px",
    margin: "0px 13px",
    padding: "6px 17px",
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.icon}>
            Pin-MI
          </Typography>
<<<<<<< HEAD
          <ColorLibButton 
            variant="text" 
            size="small"
            className={classes.navbar_button} 
            href="/"
          >
            Home
          </ColorLibButton>
          {["Practice", "Reivew"].map((label) => (
=======
          {["Home", "Practice", "Review"].map((label) => (
>>>>>>> UserTesting
            <ColorLibButton 
              variant="text" 
              size="small" 
              key={label} 
              className={classes.navbar_button}
            >
              {label}
            </ColorLibButton>
          ))}
          <ColorLibButton 
            variant="outlined" 
            size="small" 
            key="message" 
            className={classes.navbar_button} 
            endIcon={<KeyboardArrowDownIcon />}
          >
            Message
          </ColorLibButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
