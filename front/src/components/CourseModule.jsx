// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { List, Button } from 'semantic-ui-react';

import { addToCart, removeFromCart } from '../redux/actions/shopActions';

import type { ShopActionInType } from '../redux/actions/shopActions';

const CourseModule = props => {
  const productToAction = {
    id: props.module.courseModuleId,
    amount: props.module.price,
  };

  const handleCLick = props.inCart
    ? props.removeFromCartHandler.bind(null, productToAction)
    : props.addToCartHandler.bind(null, productToAction);
  return (
    <List
      divided
      relaxed
      selection
      key={`${props.module.name}${props.module.startDate}-list`}
    >
      <List.Item>
        <List.Content floated="right">
          <Button
            icon="shop"
            basic={!props.inCart}
            color={props.inCart ? 'grey' : 'teal'}
            key={`${props.module.name}${props.module.startDate}-button`}
            onClick={handleCLick}
          />
        </List.Content>
        <List.Content>
          <List.Header>{props.module.name}</List.Header>
          <List.Description>
            ${props.module.price}{' '}
            {props.module.startDate
              ? `, начало: ${props.module.startDate}`
              : ''}
            {props.module.weeks ? ` на ${props.module.weeks} недели(ь)` : ''}
          </List.Description>
        </List.Content>
      </List.Item>
    </List>
  );
};

const mapStateToProps = (state, ownProps) => ({
  inCart:
    state.shopReducer.cartItems.indexOf(ownProps.module.courseModuleId) !== -1,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addToCartHandler: (product: ShopActionInType) => {
    dispatch(addToCart(product));
  },
  removeFromCartHandler: (product: ShopActionInType) => {
    dispatch(removeFromCart(product));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseModule);
