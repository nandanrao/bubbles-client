import React, { Component } from 'react';
import { timeLeftInRound } from '../utils/utils';

export default class NextGame extends Component {
  render() {
    return (
      <div className="nextgame">
        <h1> Your game will begin shortly! Please take note of how you are rewarded:  </h1>
        <h2> Game begins in: <span> {timeLeftInRound(this.props.game)} </span></h2>
        <p></p>
      </div>
    );
  }
};
