// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter,
} from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import App from './containers/App';
import LoginPage from './containers/LoginPage';
import AdminPage from './containers/AdminPage';

const routes = [
  {
    path: '/',
    component: App,
    exact: true,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/admin',
    component: AdminPage,
    routes: [
      {
        path: '/admin/courses',
        name: 'Курсы',
        label: 5,
        component: () => <div>Страница курсов</div>,
      },
      {
        path: '/admin/send-invoices',
        name: 'Отправить счета',
        component: () => <div>Страница рассылки инвойсов</div>,
      },
    ],
  },
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
export const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);
const MainMenu = withRouter(props => {
  const path = props.location.pathname;
  return (
    <Menu pointing secondary>
      <Menu.Item as={Link} name="home" to="/" href="/" active={path === '/'} />
      <Menu.Item
        as={Link}
        name="login"
        to="/login"
        href="/login"
        active={path === '/login'}
      />
      <Menu.Item
        as={Link}
        name="admin"
        to="/admin"
        href="/admin"
        active={path === '/admin'}
      />
    </Menu>
  );
});

const Routes = () => (
  <Router>
    <div>
      <MainMenu />
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={`${route.path}-key`} {...route} />
        ))}
        <Route path="*" render={() => <div>Page Not Found</div>} />
      </Switch>
    </div>
  </Router>
);
export default Routes;
