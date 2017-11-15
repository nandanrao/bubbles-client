import React, { Component } from 'react';
import store from '../store';
import { push } from 'react-router-redux';
import Button from 'material-ui/Button';
import history from '../history';
import InstructionText from './InstructionText'
import './Instructions.css';

export default class Instructions extends Component {
  render() {
    return (
      <div className="instructions">
        <h1>Instructions</h1>
        <p>Congratulations! You have just become a trader! Please read the instructions carefully:</p>
        <InstructionText />

        <p>When you're ready, click below to login with Google, please use your UPF account for this Login, this is important!</p>

        <Button raised onClick={this.props.login}> Login with Google (UPF)</Button>
      </div>
    );
  }
}
