// @flow
import * as React from 'react';
import { Card } from 'semantic-ui-react';
import styled from 'styled-components';

import CourseModule from './CourseModule';

const Letter = styled.div`
  font-size: 120px;
  color: gray;
  text-align: center;
`;

const Course = props => (
  <Card key={`${props.item.name}${props.item.startAt}-card`}>
    <Letter>{props.item.name.charAt(0).toUpperCase()}</Letter>
    <Card.Content>
      <Card.Header>{props.item.name}</Card.Header>
      <Card.Meta>
        <span className="date">Начало курса: {props.item.startAt}</span>
      </Card.Meta>
      <Card.Description>{props.item.description}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      {props.item.modules.map(el => (
        <CourseModule module={el} key={`${el.courseModuleId}-course-module`} />
      ))}
    </Card.Content>
  </Card>
);

export default Course;
