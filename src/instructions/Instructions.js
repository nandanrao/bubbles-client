import React, { Component } from 'react';
import store from '../store';
import { push } from 'react-router-redux';
import Button from 'material-ui/Button';
import history from '../history';
import './Instructions.css';

export default class Instructions extends Component {
  render() {
    return (
      <div className="instructions">
        <h1>Instructions</h1>
        <p> This is how you play... </p>
        <Button raised onClick={ () => history.replace('/play') }> Play! </Button>
      </div>
    );
  }
}
