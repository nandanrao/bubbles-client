import React, { Component } from 'react';
import { timeLeftInRound } from '../utils/utils';

export default class NextGame extends Component {
  render() {

    const control = () => {
      return (
        <div className="rewards control">
        <p> You will play two rounds of the trading game (each with 8 periods). You will be rewarded based on how much cash you have in your portfolio at the end of each round: the more cash at the end of a round, the more points you will recieve, 1 point for every $1, up to a maximum of 50 points per round. Your total reward will be a sum of your rewards at the end of each round (maximum of 100 points). </p>
        </div>
      )
    }

    const treated = () => {
      return(
          <div className="rewards treated">
          <p> The value of your portfolio will be calculated at the end of each trading period. </p>
          <p>The value is: your cash + stocks, valued at the last traded price. </p>
          <p> You will be ranked against the other players according to the <em> increase in your portfolio value </em> at each round. </p>

          <p>Each period you can reach a maximum of 5 points depending on how well you perform <em> in that period </em>: The best trader receives 5 points, the worst trader receives 1 point. Your reward for participation in the project will be a sum of the points in <em> each </em> round, so the more rounds in which you rank first, the more points you will recieve in the end. </p>

          <p> Your rank for each previous round is shown at the bottom of the trading screen, as well as the dividend paid out by each stock and your portfolio value. </p>
          </div>
      )
    }

    return (
      <div className="nextgame">
        <h1> You have been matched with others! </h1>

        <h2> Game begins in: <span> {timeLeftInRound(this.props.game)} </span></h2>

        <h2> Please take note of how you will be rewarded for your participation:  </h2>

      { this.props.game.treated ? treated() : control() }
      </div>
    );
  }
};
