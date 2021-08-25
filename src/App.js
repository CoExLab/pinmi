import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import {ActiveStepProvider, PinsProvider, SessionProvider, UserModeProvider} from './context/index';
import Landing from './components/layout/Landing';
import Content from './components/layout/Content';
import { Provider } from "react-redux";
import { store } from "./components/Store";
// import 'default-passive-events';
/* "default-passive-events": "^2.0.0", */

const App = () => {
	return (
    <Router>
      <Provider store={store}>
        <SessionProvider>
          <ActiveStepProvider>
            <PinsProvider>
              <UserModeProvider>
                <main>
                  <Switch>
                    <Route exact path='/' component={Landing}/>
                    <Route exact path="/content" component={Content}/>
                  </Switch>
                </main>
              </UserModeProvider>
            </PinsProvider>
          </ActiveStepProvider>
        </SessionProvider>
      </Provider>
    </Router>
	)
}

export default App;