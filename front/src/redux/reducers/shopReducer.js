// @flow
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/shopActions';
import type { ShopActionType } from '../actions/shopActions';

export type ShopStoreType = {
  cartItems: Array<number>,
  cartAmount: number,
};

const initialState: ShopStoreType = {
  cartItems: [],
  cartAmount: 0,
};

function shopReducer(
  state: ShopStoreType,
  action: ShopActionType
): ShopStoreType {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case ADD_TO_CART:
      if (
        state.cartItems.indexOf(action.payload.id) === -1 &&
        action.payload.id
      ) {
        return Object.assign({}, state, {
          cartItems: [...state.cartItems, action.payload.id],
          cartAmount: state.cartAmount + action.payload.amount,
        });
      }
      break;

    case REMOVE_FROM_CART:
      if (
        state.cartItems.indexOf(action.payload.id) !== -1 &&
        action.payload.id
      ) {
        const cartAmount = state.cartAmount - (action.payload.amount || 0);
        return Object.assign({}, state, {
          cartItems: state.cartItems.filter(r => r !== action.payload.id),
          cartAmount: cartAmount > 0 ? cartAmount : 0,
        });
      }
      break;

    default:
  }
  // For now, don't handle any actions
  // and just return the state given to us.
  return state;
}

export default shopReducer;
