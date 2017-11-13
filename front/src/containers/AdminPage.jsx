import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Label, Menu, Grid } from 'semantic-ui-react';
import { RouteWithSubRoutes } from '../Routes';

const AdminPage = props => {
  const path = props.location.pathname;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={3} stretched>
          <Menu vertical>
            {props.routes.map((route, i) => (
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
          {props.routes.map((route, i) => (
            <RouteWithSubRoutes key={`${route.path}-key`} {...route} />
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withRouter(AdminPage);
