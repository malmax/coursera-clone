// @flow
import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Loader, List, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { addToCart, removeFromCart } from '../redux/actions/shopActions';

import type { ShopActionInType } from '../redux/actions/shopActions';
import type { ShopStoreType } from '../redux/reducers/shopReducer';

type Props = {
  store: ShopStoreType,
  addToCartHandler: Function,
  removeFromCartHandler: Function,
  data: {
    loading: boolean,
  },
};

const Letter = styled.div`
  font-size: 120px;
  color: gray;
  text-align: center;
`;
const HomePage = (props: Props) => {
  if (props.data.loading) {
    return <Loader />;
  }

  const renderList = m => {
    const productToAction = {
      id: m.courseModuleId,
      amount: m.price,
    };
    const inCart = props.store.cartItems.indexOf(m.courseModuleId) !== -1;

    const handleCLick = inCart
      ? props.removeFromCartHandler.bind(null, productToAction)
      : props.addToCartHandler.bind(null, productToAction);
    return (
      <List divided relaxed selection key={`${m.name}${m.startDate}-list`}>
        <List.Item>
          <List.Content floated="right">
            <Button
              icon="shop"
              basic
              color={inCart ? 'grey' : 'teal'}
              key={`${m.name}${m.startDate}-button`}
              onClick={handleCLick}
            />
          </List.Content>
          <List.Content>
            <List.Header>{m.name}</List.Header>
            <List.Description>
              ${m.price} {m.startDate ? `, начало: ${m.startDate}` : ''}
              {m.weeks ? ` на ${m.weeks} недели(ь)` : ''}
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
    );
  };

  return (
    <Card.Group doubling stackable>
      {props.data.courseGetAll.map(el => {
        const key = `${el.name}${el.startAt}`;

        return (
          <Card key={`${key}-card`}>
            <Letter>{el.name.charAt(0).toUpperCase()}</Letter>
            <Card.Content>
              <Card.Header>{el.name}</Card.Header>
              <Card.Meta>
                <span className="date">Начало курса: {el.startAt}</span>
              </Card.Meta>
              <Card.Description>{el.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>{el.modules.map(renderList)}</Card.Content>
          </Card>
        );
      })}
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

const mapStateToProps = (state, ownProps) => ({
  store: state.shopReducer,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addToCartHandler: (product: ShopActionInType) => {
    dispatch(addToCart(product));
  },
  removeFromCartHandler: (product: ShopActionInType) => {
    dispatch(removeFromCart(product));
  },
});

export default compose(
  graphql(ListCourses),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
