import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isWrapup, timeLeftInRound, needDividends, emptyDividends, isPractice, getRound, activeGame, timeLeft } from '../utils/utils';
import { canMakeOffer, currentPosition, getTotalPortfolio, getOpenOrders } from '../order-book/OrderCalcs';
import OrderBook from '../order-book/OrderBook';
import Portfolio from '../portfolio/Portfolio';
import Timeline from '../timeline/Timeline';
import Wrapup from '../wrapup/Wrapup';
import Waiting from './Waiting';
import NextGame from './NextGame';
import { DIVIDEND_PAYMENT, submitOrder, getDividends } from '../actions';
import {store} from '../store';
import Auth from '../auth/Auth';
import {initialPortfolio} from '../constants';

import './Play.css';

class Play extends Component {

  _submitOrder(type, amount) {
    if (amount <= 0) return;
    const order = {
      type,
      amount: +amount,
      user: this.props.user._id,
      round: this.props.round,
      timestamp: Date.now(),
      game: this.props.game
    };
    if (canMakeOffer(order, this.props.position)) {
      store.dispatch(submitOrder(order));
    }
  }

  render() {
    const [assets, cash] = this.props.portfolio;

    // do something with this practice
    const practice = isPractice(this.props.round) ? <p> This is just a practice round, your game will start at the end of this round, take this time to look around and try submitting orders! Others are playing as well. Note that your portfolio, the number of cash and stocks you own, will not change in this practice round, nor will you recieve any dividends.</p> : null;

    const renderPlay = () => {
      return (<div className="Play">
              { practice }
              <OrderBook
              submit={this._submitOrder.bind(this)}
              user={this.props.user._id}
              orders={getOpenOrders(this.props.orders, this.props.round)}
              />
              <Portfolio round={this.props.round} game={this.props.game} cash={cash} assets={assets}/>
              <Timeline user={this.props.user} orders={this.props.orders} round={this.props.round} game={this.props.game} dividends={this.props.dividends} />
              </div>)
    }

    if (!this.props.game) {
      return (<Waiting />)
    }
    if (isPractice(this.props.round)) {
      return (
        <NextGame game={this.props.game} />
      )
    }
    if (isWrapup(this.props.round)) {
      return (<Wrapup portfolio={this.props.portfolio} user={this.props.user} orders={this.props.orders} round={this.props.round} game={this.props.game} dividends={this.props.dividends}/>)
    }
    return renderPlay()
  }
}

// where to put  ALL THIS???

setInterval(() => store.dispatch({ type: 'TICK' }), 1000);

const mapStateToProps = state => {
  const game = activeGame(state.user);
  const round = getRound(game);
  const orders = game ? state.orders.filter(o => o.game._id === game._id) : [];

  // disaster of a check, shouldn't probably also be here...
  if (emptyDividends(game, state.dividends)) {
    store.dispatch({ type: DIVIDEND_PAYMENT, dividends: []})
  } else if (needDividends(game, state.dividends)) {
    store.dispatch(getDividends())
  }

  return {
    orders: orders,
    position: currentPosition(round, state.dividends, orders, state.user._id, initialPortfolio),
    game: game,
    dividends: state.dividends,
    round: round,
    user: state.user,
    portfolio: getTotalPortfolio(state.dividends, orders, state.user._id, initialPortfolio)
  }
};

export default connect(mapStateToProps)(Play);
