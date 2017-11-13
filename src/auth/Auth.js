import auth0 from 'auth0-js';
import history from '../history';
import { SERVER_URL } from '../constants';
import fetch from 'isomorphic-fetch'
import {socket} from '../socket';
import {store} from '../store';
import {authLogin, authLogout, getUser} from '../actions';

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'nandan.auth0.com',
    clientID: 'cEf1w7ao4r0gqM4889Dmfki0kB48a4ah',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://nandan.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  userProfile;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    store.dispatch(authLogout());
    socket.disconnect();
    history.replace('/');
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err)
        else if (authResult && authResult.accessToken && authResult.idToken) {
          resolve(authResult);
        };
      });
    }).then(authResult => {
      // make get request to server to create/get user profile
      store.dispatch(getUser(authResult.idToken));
      store.dispatch(authLogin(authResult));
    });
  }


  isAuthenticated(auth) {
    if (!auth || !auth.idTokenPayload) return false;
    const expiresAt = (auth.idTokenPayload.iat + auth.expiresIn) * 1000;
    return new Date().getTime() < expiresAt;
  }
}

export default new Auth();
