import Immutable from 'immutable';
import { combineReducers } from 'redux';
import _ from 'lodash';
import { routerReducer } from 'react-router-redux'
import {socket} from './socket';
import {store} from './store';
import { getUser, NEW_GAMES, ROUND_END, DIVIDEND_PAYMENT, SOCKET_CONNECT, AUTH_LOGIN, AUTH_LOGOUT, USER_PROFILE, SUBMIT_ORDER } from './actions';

function orders (state = [], action) {
  switch (action.type) {
    // game change, empty orders to only those in new game?
  case SUBMIT_ORDER:
    return [...state, action.payload]
  default:
    return state;
  }
};

function dividends(state = [], action) {
  switch (action.type) {
  case DIVIDEND_PAYMENT:
    console.log('DIVIDEND: ', action.dividends)
    return action.dividends;
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

function clock(state = Date.now(), action) {
  switch (action.type) {
  case 'TICK':
    return Date.now()
  default:
    return state;
  }
}

export default { orders, clock, dividends, user, auth, router: routerReducer };
