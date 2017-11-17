// @flow

export const ADD_TO_CART: string = 'ADD_TO_CART';
export const REMOVE_FROM_CART: string = 'REMOVE_FROM_CART';

export type ShopActionType = {
  type: string,
  payload: {
    id: number,
    amount: number,
  },
};
export type ShopActionInType = {
  id: number,
  amount?: number,
};

export function addToCart(product: ShopActionInType): ShopActionType {
  if (!product.id) {
    throw new Error('Нет product id');
  }
  return {
    type: ADD_TO_CART,
    payload: {
      id: product.id,
      amount: product.amount || 0,
    },
  };
}

export function removeFromCart(product: ShopActionInType): ShopActionType {
  if (!product.id) {
    throw new Error('Нет product id');
  }
  return {
    type: REMOVE_FROM_CART,
    payload: {
      id: product.id,
      amount: product.amount || 0,
    },
  };
}
