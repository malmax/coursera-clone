// @flow
import * as React from 'react';
import { Label, Menu, Grid } from 'semantic-ui-react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import MenuShared from './MenuShared';
import HomePage from '../containers/HomePage';
import AdminStudents from '../containers/AdminStudents';
import AdminInvoices from '../containers/AdminInvoices';

const routes = [
  {
    path: '/admin',
    name: 'Курсы',
    exact: true,
    restrictedRoles: ['admin'],
    label: 5,
    component: () => <HomePage />,
  },
  {
    path: '/admin/courses/add',
    restrictedRoles: ['admin'],
    name: '- отправить инвойсы',
    component: AdminInvoices,
  },
  {
    path: '/admin/courses/payments',
    restrictedRoles: ['admin'],
    name: '- студенты',
    component: AdminStudents,
  },
];

const CheckRoute = ({ role, restrictedRoles, path, ...props }) => {
  if (restrictedRoles.length && restrictedRoles.indexOf(role) === -1) {
    return <Redirect to="/login" state={{ from: path }} />;
  }

  return <Route key={`${props.path}-key`} {...props} />;
};

const AdminLayout = props => {
  const path = props.location.pathname;
  let role = '';
  try {
    const decoded = decode(localStorage.getItem('token'));
    role = decoded.role || '';
  } catch (e) {}

  return (
    <div>
      <MenuShared />
      <Grid>
        <Grid.Row>
          <Grid.Column width={3} stretched>
            <Menu vertical>
              {routes.map((route, i) => (
                <Menu.Item
                  as={Link}
                  to={route.path}
                  href={route.path}
                  name={route.name}
                  key={`${route.path}-key`}
                  active={path === route.path}
                >
                  {route.label ? (
                    <Label color={path === route.path ? 'teal' : 'grey'}>
                      {route.label}
                    </Label>
                  ) : (
                    ''
                  )}
                  {route.name}
                </Menu.Item>
              ))}
            </Menu>
          </Grid.Column>
          <Grid.Column width={12} stretched>
            <Switch>
              {routes.map((route, i) => (
                <CheckRoute
                  role={role}
                  path={path}
                  key={`${route.path}-key`}
                  {...route}
                />
              ))}
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};
export default AdminLayout;
