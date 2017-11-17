import { createStore, combineReducers } from 'redux';
import shopReducer from './reducers/shopReducer';

const store = createStore(
  combineReducers({
    shopReducer,
  })
);

export default store;
