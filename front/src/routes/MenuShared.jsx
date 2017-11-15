// @flow
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const menuItems = [
  {
    path: '/',
    name: 'Home',
    restrictedRoles: [],
  },
  {
    path: '/login',
    name: 'Login',
    restrictedRoles: [],
  },
  {
    path: '/admin',
    name: 'Admin',
    restrictedRoles: ['admin'],
  },
];

const MainMenu = props => {
  const path = props.location.pathname;
  return (
    <Menu pointing secondary>
      {menuItems.map(m => (
        <Menu.Item
          key={`menu-item-${m.path}`}
          as={Link}
          name={m.name}
          to={m.path}
          href={m.path}
          active={path === m.path}
        />
      ))}
    </Menu>
  );
};

export default withRouter(MainMenu);
