import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {store, persistor} from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'

ReactDOM.render(<Provider store={store}><PersistGate persistor={persistor}><App /></PersistGate></Provider>, document.getElementById('root'));
registerServiceWorker();
