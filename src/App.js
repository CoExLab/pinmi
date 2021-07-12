import React from 'react';
import {ActiveStepProvider, PinsProvider, SessionProvider, UserModeProvider} from './context/index'
import Content from './components/layout/Content';
import { Provider } from "react-redux";
import { store } from "./components/Store";
// import 'default-passive-events';
/* "default-passive-events": "^2.0.0", */

const App = () => {
    return (
        <Provider store={store}>
            <SessionProvider>
                <ActiveStepProvider>
                    <PinsProvider>
                        <UserModeProvider>
                            <main>
                                <Content />
                            </main>
                        </UserModeProvider>
                    </PinsProvider>
                </ActiveStepProvider>
            </SessionProvider>
        </Provider>
    )
}

export default App;