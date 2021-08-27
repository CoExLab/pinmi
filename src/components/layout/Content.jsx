import React from 'react';
import Steppers from './Steppers';
import Modules from './Modules';
import Container from '@material-ui/core/Container';

// main content component

const Content = () => {
    return (
        <section>    
            <Container maxWidth="md">
                <Steppers />
                <Modules />
            </Container>
        </section>
    );
};

export default Content;