 import React, { Component } from 'react';
import { getRound, activeGame, timeLeftInRound} from '../utils/utils';
import {store} from '../store';
import Review from './Review';
import './Timeline.css';

function computeRound(round) {
  if (round === null) return 'PRACTICE'
  return round + 1
}

class Timeline extends Component {

  render() {

    return (
      <div className="timeline">
        <h2> Current Round: <span>{computeRound(this.props.round)} / {this.props.game.conf.rounds}</span></h2>
        <h2> Time Left in Round: <span>{timeLeftInRound(this.props.game)}</span></h2>
        <Review user={this.props.user} orders={this.props.orders} game={this.props.game} round={this.props.round} dividends={this.props.dividends} />
      </div>
    )
  }
}


export default Timeline;
