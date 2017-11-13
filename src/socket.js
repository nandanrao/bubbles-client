import io from 'socket.io-client';
import { SERVER_URL } from './constants';
import { NEW_GAMES, SOCKET_CONNECT, SUBMIT_ORDER } from './actions';

import auth from './auth/Auth';

const socket = io(SERVER_URL);

function init (socket, store) {
  const socketEvents = [ SOCKET_CONNECT, SUBMIT_ORDER, NEW_GAMES ];

  socketEvents
    .forEach(type => {
      socket.on(type, payload => {
        store.dispatch({ type, payload })
      })
    });
};

socket
  .on('authenticated', function () {
    console.log('authenticated')
  })
  .on('unauthorized', function(msg) {
    console.log("unauthorized: " + JSON.stringify(msg.data));
    // throw new Error(msg.data.type);
  })



export {socket, init};
