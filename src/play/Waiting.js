import React, { Component } from 'react';
import InstructionText from '../instructions/InstructionText';
export default class Waiting extends Component {


render() {
    return (
      <div className="waiting">
        <h1> Waiting Room </h1>
        <p> Waiting for other players to join the game. </p>
        <p>We will connect you with 5 other players as soon as they are online and ready. If nothing happens after several minutes, please try refreshing your browser. </p>

        <p>If you have waited for 15 minutes and have not been connected to a game, we do not have enough other players to connect you with, so you should probably give up, sorry, the fact that you logged in and waited will be recorded!</p>
        <p> In the mean time, you can review the instructions: </p>
        <br /><br />
        <InstructionText />
      </div>
    );
  }
}
