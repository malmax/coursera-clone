import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  Button,
  Form,
  Grid,
  Message,
  Segment,
  Header,
} from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';

const ErrorMessage = props => (
  <Message error header="Ошибка авторизации" content={props.errorMsg} />
);

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email || '',
      password: '',
      error: props.error || '',
      loading: false,
      redirectToReferrer: false,
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
  }

  handleInput(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
      error: '',
    });
  }

  toggleLoading() {
    this.setState({
      ...this.state,
      loading: !this.state.loading,
    });
  }

  async handleLoginRequest(e) {
    e.preventDefault();

    if (!this.state.email || !this.state.password) {
      return false;
    }

    this.toggleLoading();
    try {
      const response = await this.props.mutate({
        variables: {
          email: this.state.email,
          password: this.state.password,
        },
      });

      const { data: { tryLogin: { token, refreshToken } } } = response;
      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        this.setState({
          ...this.state,
          loading: false,
          redirectToReferrer: true,
        });

        return true;
      }
      this.setState({
        ...this.state,
        loading: false,
        error: 'Ошибка авторизации!',
      });
    } catch (er) {
      this.setState({
        ...this.state,
        loading: false,
        error: er.toString().replace('Error: GraphQL error:', ''),
      });
      return false;
    }

    return false;
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div style={{ height: '100%' }}>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="blue" textAlign="center">
              Авторизация
            </Header>
            {this.state.error && <ErrorMessage errorMsg={this.state.error} />}
            <Form
              size="large"
              onSubmit={this.handleLoginRequest}
              loading={this.state.loading}
            >
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  name="email"
                  value={this.state.email}
                  label="Введите email"
                  placeholder="name@email.com"
                  onChange={this.handleInput}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  value={this.state.password}
                  label="Введите пароль"
                  type="password"
                  placeholder="пароль"
                  onChange={this.handleInput}
                />
                <Button
                  onClick={this.handleLoginRequest}
                  color="blue"
                  fluid
                  size="large"
                >
                  Войти
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

LoginPage.defaultProps = {
  error: '',
  email: '',
};

const tryLogin = gql`
  mutation tryLogin($email: String!, $password: String!) {
    tryLogin(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`;

export default graphql(tryLogin, {
  options: ({ email, password }) => ({
    variables: {
      email,
      password,
    },
  }),
})(LoginPage);
