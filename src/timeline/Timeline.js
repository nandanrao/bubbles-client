import React, { Component } from 'react';
import { getRound, activeGame, timeLeftInRound} from '../utils/utils';
import {store} from '../store';
import './Timeline.css';

function computeRound(round) {
  if (round === null) return 'PRACTICE'
  return round + 1
}

class Timeline extends Component {

  render() {
    const divs = this.props.dividends.map((d,i) => {
      return <li key={i}>  <span> {d}</span> </li>
    })
    return (
      <div className="timeline">
        <h2> Current Round: <span>{computeRound(this.props.round)} / {this.props.game.conf.rounds}</span></h2>
        <h2> Time Left in Round: <span>{timeLeftInRound(this.props.game)}</span></h2>
        <h2> Past Dividends: </h2>
        <ul className="dividends">
          {divs}
        </ul>
      </div>
    )
  }
}


export default Timeline;
