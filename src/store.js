import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import history from './history';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import {init, socket} from './socket';



const config = {
  key: 'root',
  storage,
};

const reducer = persistCombineReducers(config, reducers);

export const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware.withExtraArgument(socket),
    routerMiddleware(history)
    // createLogger({predicate: (getState, action) => action.type !== 'TICK'})
  )
);

init(socket, store);

export const persistor = persistStore(store);

// export store;
// export persister;
