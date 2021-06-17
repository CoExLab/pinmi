import React from 'react';
import Steppers from './Steppers';
import ButtonUI from './ButtonUI';
import Modules from './Modules';

const Content = () => {
    return (
        <section>            
            <Steppers />
            <Modules />
            <ButtonUI />
        </section>
    );
};

export default Content;