// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import LoginPage from '../containers/LoginPage';
import HomePage from '../containers/HomePage';
import ClientHeader from '../components/ClientHeader';
import MenuShared from './MenuShared';
import CheckoutPage from '../containers/CheckoutPage';

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
  {
    path: '/checkout',
    component: CheckoutPage,
  },
];

const ClientLayout = () => (
  <div>
    <MenuShared />
    <ClientHeader />
    <Divider />
    <Container>
      <Switch>
        {routes.map((route, i) => (
          <Route key={`${route.path}-route-key`} {...route} />
        ))}
      </Switch>
    </Container>
  </div>
);
export default ClientLayout;
