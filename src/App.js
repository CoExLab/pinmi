import React from 'react';
import {ActiveStepProvider} from './context/index'
import Content from './components/layout/Content';

const App = () => {
    return (
        <ActiveStepProvider>
            <main>
                <Content />
                <h1>"hello world"</h1>
            </main>
        </ActiveStepProvider>
    )
}

export default App;