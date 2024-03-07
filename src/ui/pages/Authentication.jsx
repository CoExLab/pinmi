import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import AuthenticationBox from './AuthenticationBox';

import { useUser } from '../../contexts/userContext';

// Authentication Page
const Authentication = () => {
  return (
    <section>
      <Navbar />
      <AuthenticationBox />
    </section>
  );
};

export default Authentication;
