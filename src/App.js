import React from 'react';
import {ActiveStepProvider, PinsProvider} from './context/index'
import Content from './components/layout/Content';
// import 'default-passive-events';
/* "default-passive-events": "^2.0.0", */

const App = () => {
    return (
        <ActiveStepProvider>
            <PinsProvider>
                <main>
                    <Content />
                </main>
            </PinsProvider>
        </ActiveStepProvider>
    )
}

export default App;