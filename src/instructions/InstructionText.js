import React, { Component } from 'react';
import Button from 'material-ui/Button';
import InstructionText from './InstructionText'
import './Instructions.css';

export default class Instructions extends Component {
  render() {
    return (
      <div className="instruction-text">
        <p>You will be trading a single type of stock with 5 other traders in the game. Stocks have random payouts, which are paid to whoever is holding them at the time. Your success in the game is therefore based on your ability to judge the risk of holding a stock, your luck in holding a lot of stock when payouts are high, and, of course, your ability to buy low and sell high in order to make yourself a profit. </p>

        <p>There is only one type of stock in the game. You will start with $20 cash and 5 units of the stock. You will play 2 rounds, back-to-back. Each round has 8 separate trading periods. One period lasts 60 seconds. After each period a random dividend will be paid for every stock in your possession. The payout is the same for each stock, so the more stocks you hold, the larger your (potential) payout. </p>

        <p>To buy a stock, you submit an "offer" with the highest price at which you are willing to buy. To sell a stock, you submit an offer at the lowest price at which you are willing to sell. There is a public "offer board", which everyone can see. If one trader submits an offer to buy at a higher price than that of an outstanding offer to sell, the trade will go through at the price the seller posted (trades always happen at the lower of the two prices). If a trader submits an offer to sell which is lower than the current lowest offer to buy, the trade will go through, again, at the sellers price. </p>

        <p>The dividend payments can be: ($0.00, $0.16, $0.32, $0.80) with equal probability. The average payout is $0.32/round for each stock. Remember we have 8 trading periods per round. </p>

        <p>You cannot sell stocks you do not own. You can only buy as many stocks as your cash allows. </p>

        <div className="layout-instructions">
          <h2> On the trading screen you can see: </h2>
          <div className="splits">
            <div className="left">
              <h3>Top Left List: </h3>
              <p>First entry is the best offer to buy a stock.</p>
              <p>(Click on the first entry to sell immediately at that price)</p>
              <p>Fill in the field to specify a buy offer</p>
              <p>Confirm your offer by pressing enter or clicking on submit. </p>
            </div>

            <div className="right">
              <h3>Top Right list: </h3>
              <p>First entry is the best offer to sell a stock.</p>
              <p>(Click on the first entry to buy immediately at that price)</p>
              <p>Fill in the field to specify a sell offer</p>
              <p>Confirm your offer by pressing enter or clicking on submit. </p>
            </div>
          </div>
          <div className="bottom">
            <h3> Bottom: </h3>
            <p>Available cash you can use to buy stock ($20 initially)</p>
            <p>The amount of stocks in your possession (5 initially)</p>
            <p>A history of your performance in past periods this round</p>
          </div>
        </div>
      </div>
    );
  }
}
