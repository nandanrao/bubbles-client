import React, { Component } from 'react';
import { connect } from 'react-redux';
import Play from './play/Play';
import logo from './logo.svg';

import history from './history';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import './App.css';
import auth from './auth/Auth';
import Consent from './consent/Consent';
import Callback from './Callback';
import Instructions from './instructions/Instructions.js'
import connectSocket from './socket';
import {store} from './store';
import {getUser} from './actions';

// Connect auth0


function renderCallback(a) {
  if (auth.isAuthenticated(a)) {
    return <Redirect to={{pathname: '/instructions'}} />
  }

  auth.handleAuthentication()
    .then(() => history.replace('/instructions'))
    .catch(err => {
      console.error('HANDLE AUTH ERROR: ', err)
      history.replace('/error')
    });

  return <Callback />
}

// continuous polling for new user info (games!?)
// setInterval(() => {
//   const token = auth.getIdToken();
//   if (token) store.dispatch(getUser(token));
// }, 1000)


class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Market</h1>
          <button onClick={auth.logout}>logout</button>
        </header>
        <ConnectedRouter history={history}>
          <div>
            <Route exact path="/" render={props => {
                return auth.isAuthenticated(this.props.auth) ?
                <Instructions {...props} /> :
                  <Consent {...props} login={auth.login} />;
              }}/>
            <Route exact path="/callback" render={ p => renderCallback(this.props.auth)}/>
            <Route exact path="/instructions" component={Instructions} />
            <Route exact path="/play" component={Play} />
            <Route exact path="/consent" render={props => {
                return <Consent {...props} login={auth.login}/>
              }}/>
          </div>
        </ConnectedRouter>

      </div>
    );
  }
}

const initialPortfolio = [5, 10.00] // TODO: WHERE DOES THIS GO?? GET FROM SETTINGS?

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps)(App);
