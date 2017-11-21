import * as React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { Icon, Table } from 'semantic-ui-react';

const AdminStudents = props => {
  if (props.data.loading) return <div>waiting response</div>;

  const users = props.data.orderGetStudentModules;
  const courses = _.chain(users)
    .map(el => el.ordered)
    .flatten()
    // .map(el => _.pick(el, ['courseName', 'courseModule', 'courseModuleId']))
    .uniqBy('courseModuleId')
    .groupBy('courseName')
    .value();

  console.log(courses);
  return (
    <Table celled structured>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Email</Table.HeaderCell>
          {Object.keys(courses).map(courseName => (
            <Table.HeaderCell
              textAlign="center"
              key={`course-header-${courseName}`}
              colSpan={courses[courseName].length}
            >
              {courseName}
            </Table.HeaderCell>
          ))}
        </Table.Row>
        <Table.Row>
          {Object.keys(courses).map(courseName => {
            const course = courses[courseName];
            return course.map(el => (
              <Table.HeaderCell
                textAlign="center"
                key={`course-module-header-${el.courseModuleId}`}
              >
                {el.courseModule}
              </Table.HeaderCell>
            ));
          })}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.map(user => (
          <Table.Row key={`user-${user.email}`}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            {Object.keys(courses).map(courseName => {
              const course = courses[courseName];
              return course.map(el => {
                const index = _.findIndex(user.ordered, {
                  courseModuleId: el.courseModuleId,
                });
                const paid = index !== -1 ? user.ordered[index].paid : false;
                return (
                  <Table.Cell
                    textAlign="center"
                    key={`paid-${el.courseModuleId}-user-${user.email}`}
                  >
                    {paid ? (
                      <Icon color="green" name="checkmark" size="large" />
                    ) : (
                      <Icon color="grey" name="remove" size="large" />
                    )}
                  </Table.Cell>
                );
              });
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const orderGetStudentModules = gql`
  {
    orderGetStudentModules {
      transactionId
      paid
      email
      name
      ordered {
        paid
        courseName
        courseModule
        courseModuleId
      }
    }
  }
`;
export default compose(graphql(orderGetStudentModules))(AdminStudents);
