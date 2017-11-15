import React, { Component } from 'react';
import { getRound, activeGame, timeLeftInRound} from '../utils/utils';
import {store} from '../store';
import './Wrapup.css';
import Review from '../timeline/Review';
function computeRound(round) {
  if (round === null) return 'PRACTICE'
  return round + 1
}

class Wrapup extends Component {

  render() {
    const [assets, cash] = this.props.portfolio;

    const summary = this.props.game.treated ?
          <div className="summary"><p> Take a look at your performance each round. Another game will begin shortly if this was your first! </p></div> :
          <div className="summary"><p> You finished with <span>{ '$' + cash.toFixed(2) } </span>! Get ready for another game if this was your first!</p></div>

    return (
        <div className="wrapup">
          <h1> Game Finished! </h1>
          { summary }
          <Review user={this.props.user} orders={this.props.orders} round={this.props.round} game={this.props.game} dividends={this.props.dividends} />
        </div>
    )
  }
}


export default Wrapup;
