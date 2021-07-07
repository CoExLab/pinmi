import React from 'react';
import {ActiveStepProvider, PinsProvider, SessionProvider} from './context/index'
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
                        <main>
                            <Content />
                        </main>
                    </PinsProvider>
                </ActiveStepProvider>
            </SessionProvider>
        </Provider>
    )
}

export default App;