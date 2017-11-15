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



// window.location is hack to deal with weird bugzz
function renderCallback(a) {
  if (auth.isAuthenticated(a)) {
    // return <Redirect to={{pathname: '/play'}} />
    window.location.assign('./play')
  }

  auth.handleAuthentication()
    .then(() => window.location.assign('./play'))
    .catch(err => {
      console.error('HANDLE AUTH ERROR: ', err)
      history.replace('/error')
    });

  return <Callback />
}


class App extends Component {

  render() {

    const getLogout = () => {
      return auth.isAuthenticated(this.props.auth) ? (<button onClick={auth.logout}>logout</button>) : null;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Financial Trading Simulation</h1>
          { getLogout() }
        </header>
        <ConnectedRouter history={history}>
          <div>
            <Route exact path="/" render={props => {
                return auth.isAuthenticated(this.props.auth) ?
                <Redirect to="/play"/> :
                  <Redirect to="/consent" />
                  }}/>
                  <Route exact path="/callback" render={ p => renderCallback(this.props.auth)}/>
                    <Route exact path="/instructions" render={props => {
                        return <Instructions {...props} login={auth.login}/>
                      }}/>
                      <Route exact path="/play" render={props => {
                          return auth.isAuthenticated(this.props.auth) ?
                          <Play/> :
                            <Redirect to="/consent" />
                        }} />
                      <Route exact path="/consent" component={Consent}/>
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
