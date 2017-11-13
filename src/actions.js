import fetch from 'isomorphic-fetch';
import { SERVER_URL } from './constants';
export const SUBMIT_ORDER = 'SUBMIT_ORDER';
export const DIVIDEND_PAYMENT = 'DIVIDEND_PAYMENT';
export const USER_PROFILE = 'USER_PROFILE';
export const ROUND_END = 'ROUND_END';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const NEW_GAMES = 'NEW_GAMES';
// export const ORDER_SUBMITTED = 'ORDER_SUBMITTED';
export const SOCKET_CONNECT = 'connect';


// CLOCK_TICK ???????
// clock state...
// map state to props should change round...
// or switch page to "waiting for next roun"
// or things like that

export function submitOrder(order) {
  return (dispatch, state, socket) => {
    console.log('state in submitOrder: ', state())
    socket.emit(SUBMIT_ORDER, order)
    dispatch({
      type: SUBMIT_ORDER,
      payload: order
    });
  }
}

export function getUser(token) {
  return (dispatch, state, socket) => {
    const token = token || state().auth.idToken;
    return fetch(`${SERVER_URL}/user` ,
                 { headers: { 'Authorization': `Bearer ${token}`}})
      .then(res => res.json())
      .then(profile => {
        dispatch({ type: USER_PROFILE, profile})
        const games = profile.games.filter(g => g.endTime > Date.now());
        if (games.length == 0) {
          socket.emit('JOIN_WAITING_ROOM')
        } else {
          profile.games.forEach(g => socket.emit('JOIN_GAME', g._id))
        }
      })
  }
}

export function authLogin(auth) {
  return {
    type: AUTH_LOGIN,
    auth
  };
}


export function authLogout(auth) {
  return {
    type: AUTH_LOGOUT
  };
}
