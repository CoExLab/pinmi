import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ActiveStepProvider, PinsProvider, SessionProvider } from './storage/context';
import Authentication from './ui/pages/Authentication';
import Landing from './ui/pages/Landing';
import Content from './ui/pages/Content';
import Completion from './ui/pages/Completion';
import Review from './ui/pages/Review';
import Home from './ui/pages/Home';
//tbr import CORsTestButtons from './ui/layout/CORsTestButtons';
import { store } from './storage/store';

import { createTheme, ThemeProvider } from '@material-ui/core';

import { firebase } from './storage/firebase';
import UserContext from './contexts/userContext';

// import 'default-passive-events';
/* "default-passive-events": "^2.0.0", */

const theme = createTheme({
  palette: {
    teal: {
      dark: '#005E7D',
      main: '#337E92',
      light: '#C2DCE7',
      lighter: '#F2F6F8',
    },
    pink: {
      dark: '#FC6D78',
      main: '#FDA2A9',
      light: '#FECACE',
    },
    gray: {
      dark: '#30394B',
      main: '#4D4D4D',
      light: '#DDEEF9',
    },
  },
  typography: {
    fontFamily: ['Lato', 'Lato', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Lato',
      fontSize: '35px',
      fontWeight: 700,
      lineHeight: '52.5px',
    },
    h2: {
      fontFamily: 'Lato',
      fontSize: '25px',
      fontWeight: 600,
      lineHeight: '37.5px',
    },
    h3: {
      fontFamily: 'Lato',
      fontSize: '22px',
      fontWeight: 400,
      lineHeight: '30px',
    },
    h4: {
      fontFamily: 'Lato',
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: '30px',
    },
    subtitle1: {
      fontFamily: 'Lato',
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '23.38px',
      letterSpacing: '-0.015em',
    },
    subtitle2: {
      fontFamily: 'Lato',
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '18.7px',
      letterSpacing: '-0.02em',
    },
    body1: {
      fontFamily: 'Lato',
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: '23.38px',
      letterSpacing: '-0.015em',
    },
    body2: {
      fontFamily: 'Lato',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '18.7px',
      letterSpacing: '-0.02em',
    },
  },
});

const App = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Logged in as: ', user.email);
        setUser(user);
        firebase.firestore().collection('firebaseUsers').doc(user.uid).set(
          {
            uid: user.uid,
            email: user.email,
          },
          { merge: true },
        );
      } else {
        console.log('Not logged in');
        setUser(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      <ThemeProvider theme={theme}>
        <Router>
          <main>
            <Switch>
              <Provider store={store}>
                <Route exact path="/auth" component={Authentication} />
                <Route exact path="/Home" component={Home} />

                <Route exact path="/Review" component={Review} />
                <SessionProvider>
                  <ActiveStepProvider>
                    <PinsProvider>
                      <Route exact path="/content" component={Content} />
                      <Route exact path="/justchat" render={() => <Landing justchat={true} />} />
                      <Route exact path="/" render={() => <Landing justchat={true} />} />
                    </PinsProvider>
                  </ActiveStepProvider>
                </SessionProvider>
                <Route exact path="/completion" component={Completion} />
              </Provider>
            </Switch>
          </main>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
};

export default App;
