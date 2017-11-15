// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginPage from '../containers/LoginPage';
import HomePage from '../containers/HomePage';
import ClientHeader from '../components/ClientHeader';
import MenuShared from './MenuShared';

const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/login',
    component: LoginPage,
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

const ClientLayout = () => (
  <div>
    <MenuShared />
    <ClientHeader />
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={`${route.path}-key`} {...route} />
      ))}
    </Switch>
  </div>
);
export default ClientLayout;
