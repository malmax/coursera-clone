import * as React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

class CheckoutPage extends React.Component {
  state = {};

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => this.setState({ email: '', name: '' });

  render() {
    const { name, email } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Input
            placeholder="Name"
            name="name"
            value={name}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit" />
        </Form.Group>
      </Form>
    );
  }
}

const getCourseModules = gql`
  {
    courseModuleGetAll {
      courseModuleId
      Course {
        name
        teacher {
          name
        }
      }
      name
      description
      price
      startDate
      weeks
      createdAt
      updatedAt
    }
  }
`;
const mapStateToProps = (state, ownProps) => ({
  store: state.shopReducer || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default compose(
  graphql(getCourseModules),
  connect(mapStateToProps, mapDispatchToProps)
)(CheckoutPage);
