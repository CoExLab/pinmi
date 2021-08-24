import React from 'react';
import { Link } from 'react-router-dom';

// main content component

const Landing = () => {
    return (
        <section>    
            This is the landing page!
            <br />
            <Link to="/content">Begin Your Preparations</Link>
        </section>
    );
};

export default Landing;