import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getTotalPortfolio, getOpenOrders } from '../order-book/OrderCalcs';
import OrderBook from '../order-book/OrderBook';
import Portfolio from '../portfolio/Portfolio';
import { submitOrder } from '../actions';
import {store} from '../store';
import Auth from '../auth/Auth';

import './Play.css';

function activeGame(user) {
  console.log(user)
  const now = Date.now();
  const g = user.games.filter(g => g.starTime < now && g.endTime > now);
  if (g.length > 0) {
    console.log("SOMETHING FISHY MORE THAN ONE ACTIVE GAME")
  }
  return g[0]
}

// setInterval
// active game, get round of game...

class Play extends Component {
  constructor(props) {
    super(props);
    // this.auth = new Auth();
    // this.auth.login();
  }

  _submitOrder(type, amount) {
    const order = {
      type,
      amount: +amount,
      user: this.props.user._id,
      round: this.props.round,
      timestamp: Date.now(),
      game: activeGame(this.props.user)
    };
    store.dispatch(submitOrder(order));
  }

  render() {
    const [assets, cash] = this.props.portfolio;

    const renderPlay = () => {
      return (<div className="Play">
              <OrderBook
              submit={this._submitOrder.bind(this)}
              user={this.props.user._id}
              orders={this.props.orders}
              />
              <Portfolio cash={cash} assets={assets}/>
              </div>)
    }

    // make this better, with a diff screen for waiting for players from waiting to start
    // renderPlay();
    return activeGame(this.props.user) ? renderPlay() : <div> waiting for game to start </div>
  }
}

const initialPortfolio = [5, 10.00] // TODO: WHERE DOES THIS GO?? GET FROM SETTINGS?

const mapStateToProps = state => {
  return {
    orders: getOpenOrders(state.orders, state.round),
    round: state.round,
    user: state.user,
    portfolio: getTotalPortfolio(state.dividends, state.orders, state.user.id, initialPortfolio)
  }
};

export default connect(mapStateToProps)(Play);
