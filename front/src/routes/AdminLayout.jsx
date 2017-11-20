// @flow
import * as React from 'react';
import { Label, Menu, Grid } from 'semantic-ui-react';
import { Route, Switch, Link } from 'react-router-dom';
import MenuShared from './MenuShared';

const routes = [
  {
    path: '/admin',
    name: 'Курсы',
    label: 5,
    component: () => <div>Страница курсов</div>,
  },
  {
    path: '/admin/courses/add',
    name: '- отправить инвойсы',
    component: () => <div>Страница курсов</div>,
  },
  {
    path: '/admin/courses/payments',
    name: '- студенты',
    component: () => <div>Страница курсов</div>,
  },
];

const AdminLayout = props => {
  const path = props.location.pathname;
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
                    <Label color={path === route.path ? 'teal' : ''}>
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
                <Route key={`${route.path}-key`} {...route} />
              ))}
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};
export default AdminLayout;
