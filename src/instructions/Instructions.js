import React, { Component } from 'react';
import store from '../store';
import { push } from 'react-router-redux';
import history from '../history';

export default class Instructions extends Component {
  render() {
    return (
      <div className="instructions">
        Instructions
      <button onClick={ () => history.replace('/play') }> Play! </button>
      </div>
    );
  }
}
