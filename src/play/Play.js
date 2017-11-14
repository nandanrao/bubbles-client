import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isPractice, getRound, activeGame, timeLeft } from '../utils/utils';
import { getTotalPortfolio, getOpenOrders } from '../order-book/OrderCalcs';
import OrderBook from '../order-book/OrderBook';
import Portfolio from '../portfolio/Portfolio';
import Timeline from '../timeline/Timeline';
import { submitOrder, getDividends } from '../actions';
import {store} from '../store';
import Auth from '../auth/Auth';

import './Play.css';

class Play extends Component {

  _submitOrder(type, amount) {
    const order = {
      type,
      amount: +amount,
      user: this.props.user._id,
      round: this.props.round,
      timestamp: Date.now(),
      game: this.props.game
    };
    store.dispatch(submitOrder(order));
  }

  render() {
    const [assets, cash] = this.props.portfolio;

    // do something with this practice
    const practice = isPractice(this.props.game) ? <p> This is just a practice round, your game will start at the end of this round, take this time to look around and try submitting orders! Others are playing as well. </p> : null;

    const renderPlay = () => {
      return (<div className="Play">
              { practice }
              <OrderBook
              submit={this._submitOrder.bind(this)}
              user={this.props.user._id}
              orders={this.props.orders}
              />
              <Portfolio cash={cash} assets={assets}/>
              <Timeline round={this.props.round} game={this.props.game} dividends={this.props.dividends} />
              </div>)
    }

    // make this better, with a diff screen for waiting for players from waiting to start
    if (!this.props.game) {
      return (<div> waiting for other players to join </div>)
    }
    return renderPlay()
  }
}

const initialPortfolio = [5, 10.00] // TODO: WHERE DOES THIS GO?? GET FROM SETTINGS?

// where to put this???
setInterval(() => store.dispatch({ type: 'TICK' }), 1000);

const mapStateToProps = state => {
  const game = activeGame(state.user);
  const round = getRound(game);
  const orders = game ? state.orders.filter(o => o.game._id === game._id) : [];
  if ((isPractice(game) && state.dividends.length !== 0) || round !== state.dividends.length) {
    store.dispatch(getDividends())
  };
  return {
    orders: getOpenOrders(orders, round),
    game: game,
    dividends: state.dividends,
    round: round,
    user: state.user,
    portfolio: getTotalPortfolio(state.dividends, orders, state.user._id, initialPortfolio)
  }
};

export default connect(mapStateToProps)(Play);
