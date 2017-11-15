import React from 'react';
import ReactDOM from 'react-dom';
import FrontLayout from './FrontLayout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FrontLayout />, div);
});
