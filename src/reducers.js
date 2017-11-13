import Immutable from 'immutable';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { routerReducer } from 'react-router-redux'
import {socket} from './socket';
import {store} from './store';
import { getUser, NEW_GAMES, ROUND_END, DIVIDEND_PAYMENT, SOCKET_CONNECT, AUTH_LOGIN, AUTH_LOGOUT, USER_PROFILE, SUBMIT_ORDER } from './actions';

function makeOrders(tuples) {
  return tuples.map(v => _.zipObject(['type', 'amount', 'timestamp', 'user', 'round'], v))
};

const initialOrders = makeOrders([
  ['bid', 0.90, 170, 'foo', 1],
  ['bid', 1.50, 170, 'foo', 1],
  ['ask', 1.00, 160, 'bar', 0],
  ['bid', 1.20, 120, 'foo', 0],
  ['ask', 1.10, 120, 'bar', 0],
  ['ask', 1.20, 100, 'bar', 0]
]);



function orders (state = initialOrders, action) {
  switch (action.type) {
  case SUBMIT_ORDER:
    console.log('SUBMIT_ORDER', action.payload)
    return [...state, action.payload]
  default:
    return state;
  }
};

function round (state = 0, action) {
  switch (action.type) {
  case ROUND_END:
    // if state == 10, end game
    // else:
    return state + 1;
  default:
    return state;
  }
};

function dividends(state = [], action) {
  switch (action.type) {
  case DIVIDEND_PAYMENT:
    console.log('DIVIDEND: ', action.payload)
    return [...state, action.payload]; // if action.payload is just the number
  default:
    return state;
  }
};

function auth(state = {}, action) {
  switch (action.type) {
  case AUTH_LOGOUT:
    return {};
  case AUTH_LOGIN:
    if (socket.connected) socket.emit('authenticate', {token: action.auth.idToken});
    return action.auth;
  case SOCKET_CONNECT:
    if (state.idToken) {
      socket.emit('authenticate', { token: state.idToken });
      store.dispatch(getUser());
    }
    return state;
  default:
    return state;
  }
}

function user(state = {}, action) {
  switch (action.type) {
  case USER_PROFILE:
    return action.profile
  case NEW_GAMES:
    store.dispatch(getUser());
    return state;
  default:
    return state;
  }
}

export default { orders, round, dividends, user, auth, router: routerReducer };
