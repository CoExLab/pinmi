import React from 'react';
import {ActiveStepProvider, PinsProvider} from './context/index'
import Content from './components/layout/Content';
import { Provider } from "react-redux";
import { store } from "./components/Store";
// import 'default-passive-events';
/* "default-passive-events": "^2.0.0", */

const App = () => {
    return (
        <Provider store={store}>
            <ActiveStepProvider>
                <PinsProvider>
                    <main>
                        <Content />
                    </main>
                </PinsProvider>
            </ActiveStepProvider>
        </Provider>
    )
}

export default App;