// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log(this.props);
    return <div>Home page</div>;
  }
}

const ListCourses = gql`
  {
    courseGetAll {
      courseId
      name
      startAt
      description
      teacher {
        name
        email
      }
      modules {
        courseModuleId
        name
        description
        price
        startDate
        weeks
        createdAt
        updatedAt
      }
    }
  }
`;

export default graphql(ListCourses)(HomePage);
