// @flow
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import decode from 'jwt-decode';

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
  let role = '';
  try {
    const decoded = decode(localStorage.getItem('token'));
    role = decoded.role || '';
  } catch (e) {}

  return (
    <Menu pointing secondary>
      {menuItems.map(m => {
        if (m.restrictedRoles.length && m.restrictedRoles.indexOf(role) === -1)
          return null;

        return (
          <Menu.Item
            key={`menu-item-${m.path}`}
            as={Link}
            name={m.name}
            to={m.path}
            href={m.path}
            active={path === m.path}
          />
        );
      })}
      <Menu.Menu position="right">
        <Menu.Item>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'cart',
              content: 'Оплатить',
              onClick: () => props.history.push('/checkout'),
            }}
            actionPosition="left"
            //  defaultValue='52.03'
            value={`${props.store.cartItems.length} курс(а) на $${
              props.store.cartAmount
            }`}
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

const mapStateToProps = (state, ownProps) => ({
  store: state.shopReducer || {},
});

export default withRouter(connect(mapStateToProps)(MainMenu));
