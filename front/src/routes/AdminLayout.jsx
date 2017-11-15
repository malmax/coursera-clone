// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import MenuShared from './MenuShared';

import AdminPage from '../containers/AdminPage';

const routes = [
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

const AdminLayout = () => (
  <div>
    <MenuShared />
    <header>
      <h2>ADMIN SECTION</h2>
    </header>
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={`${route.path}-key`} {...route} />
      ))}
    </Switch>
  </div>
);
export default AdminLayout;
