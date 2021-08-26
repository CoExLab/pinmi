import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
    textTransform: "capitalize",
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
          {["home", "practice", "review", "message"].map((label) => (
            <Button className={classes.navbar_button} key={label}>{label}</Button>
          ))}
        </Toolbar>
      </AppBar>
    </div>
  );
}
