// @flow
import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Loader } from 'semantic-ui-react';

import Course from '../components/Course';

import type { ShopStoreType } from '../redux/reducers/shopReducer';

type Props = {
  store: ShopStoreType,
  addToCartHandler: Function,
  removeFromCartHandler: Function,
  data: {
    loading: boolean,
  },
};

const HomePage = (props: Props) => {
  if (props.data.loading) {
    return <Loader />;
  }

  return (
    <Card.Group doubling stackable>
      {props.data.courseGetAll.map(el => (
        <Course item={el} key={`${el.courseId}-course`} />
      ))}
    </Card.Group>
  );
};

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

export default compose(graphql(ListCourses))(HomePage);
