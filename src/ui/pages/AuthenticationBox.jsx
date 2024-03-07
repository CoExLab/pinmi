import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import styled from 'styled-components';

import { firebase } from '../../storage/firebase';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import ColorLibButton from '../components/colorLibComponents/ColorLibButton';
import ColorLibInput from '../components/colorLibComponents/ColorLibInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Navbar from '../components/Navbar';

import pinningPreview from './../../other/tutorial/pinning-preview.gif';
import modal from './../../other/tutorial/modal.png';
import discussionPrepPreview from './../../other/tutorial/discussionPrepPreview.png';
import discussionPreview from './../../other/tutorial/discussionPreview.png';

import { setUserID, setUserMode, setSessionID } from '../../storage/store';

import { useUser } from '../../contexts/userContext';

const AuthEntry = styled.div`
  font-family: Lato;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;

  width: 400px;

  & {
    .label {
      font-size: 1.4rem;
      opacity: 0.7;
      margin-right: 16px;
      width: 150px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
`;

const useStyles = makeStyles(theme => ({
  welcome_container: {
    padding: '50px 68px 8px 68px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button_wrapper: {
    marginTop: '8px',
    marginBottom: '68px',
    textAlign: 'center',
  },
}));

// Authentication Page
const Authentication = () => {
  const classes = useStyles();

  const history = useHistory();

  const { user } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const signUp = () => {
    setError(null);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(_ => {
        setEmail('');
        setPassword('');
        history.push('/');
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });
  };

  const logIn = () => {
    setError(null);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(_ => {
        setEmail('');
        setPassword('');
        history.push('/');
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });
  };

  const logOut = () => {
    setError(null);
    firebase.auth().signOut();
  };

  if (user === undefined) {
    return null;
  }

  return (
    <section>
      {user !== null && (
        <>
          <Container className={classes.welcome_container} maxWidth="md">
            <div style={{ fontSize: '1.6rem', fontFamily: 'Lato', opacity: 0.8 }}>Current user: {user.email}</div>
          </Container>

          <div className={classes.button_wrapper}>
            <ColorLibButton variant="contained" size="small" onClick={logOut}>
              Log out
            </ColorLibButton>
          </div>
        </>
      )}
      {user === null && (
        <>
          <Container className={classes.welcome_container} maxWidth="md">
            <AuthEntry>
              <div className="label">Email:</div>
              <FormControl fullWidth>
                <ColorLibInput
                  error={isEmail(email) || email.length === 0 ? false : true}
                  variant="outlined"
                  value={email}
                  placeholder={'example@email.com'}
                  onChange={e => {
                    setEmail(e.target.value.trim());
                  }}
                />
              </FormControl>
            </AuthEntry>
            <AuthEntry>
              <div className="label">Password:</div>
              <FormControl fullWidth>
                <ColorLibInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </AuthEntry>
          </Container>
          {error !== null && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0px 10px 25px 10px',
                  color: 'red',
                  fontFamily: 'Lato',
                }}
              >
                <div style={{ maxWidth: 400 }}>
                  Sorry, an error occured: <br />
                  {error.message}
                </div>
              </div>
            </>
          )}
          <div className={classes.button_wrapper}>
            <ColorLibButton variant="contained" size="small" onClick={signUp}>
              Sign up
            </ColorLibButton>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <ColorLibButton variant="contained" size="small" onClick={logIn}>
              Log in
            </ColorLibButton>
          </div>
        </>
      )}
    </section>
  );
};

export default Authentication;
