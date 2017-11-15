import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import logo from './logo.svg';

const logoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const Header = styled.header`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;
const Logo = styled.img`
  animation: ${logoSpin} infinite 20s linear;
  height: 80px;
`;
const ClientHeader = () => (
  <div style={{ textAlign: 'center' }}>
    <Header>
      <Logo src={logo} alt="logo" />
      <h1 style={{ fontSize: '1.5em' }}>Центр Обучения Ниндзя</h1>
    </Header>
  </div>
);

export default ClientHeader;
