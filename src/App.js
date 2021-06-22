import React from 'react';
import {ActiveStepProvider, PinsProvider} from './context/index'
import Content from './components/layout/Content';

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