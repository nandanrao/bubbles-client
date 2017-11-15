import React, { Component } from 'react';
import Button from 'material-ui/Button';
import InstructionText from './InstructionText'
import './Instructions.css';

export default class Instructions extends Component {
  render() {
    return (
      <div className="instruction-text">
        <p>You will be given $20 cash and 5 units of stock. You can buy or sell 1 unit of the stock at a time.</p>
        <p>You will play 2 rounds of a trading game. Each round has 8 separate trading periods. One period lasts 60 seconds. After each period a random dividend will be paid for every stock in your possession.  The dividend payments can be: (0,16,32,80) cents with equal probability. From this you can calculate the expected value of the stock. Remember we have 8 trading periods per round. After completion of the first round, the second round starts.</p>
        <p>You cannot sell stocks you do not own. You can only buy as many stocks as your cash allows. </p>

        <div className="layout-instructions">
          <h2> On the trading screen you can see: </h2>
          <div className="splits">
            <div className="left">
              <h3>Top Left List: </h3>
              <p>First entry is the best offer to buy a stock.</p>
              <p>(Click on the first entry to sell at that price)</p>
              <p>Fill in the field to specify a buy offer</p>
              <p>Confirm your offer by pressing enter or clicking on submit. </p>
            </div>

            <div className="right">
              <h3>Top Right list: </h3>
              <p>First entry is the best offer to sell a stock.</p>
              <p>(Click on the first entry to buy at that price)</p>
              <p>Fill in the field to specify a sell offer</p>
              <p>Confirm your offer by pressing enter or clicking on submit. </p>
            </div>
          </div>
          <div className="bottom">
            <h3> Bottom: </h3>
            <p>Available cash you can use to buy stock (20$ initially)</p>
            <p>The amount of stocks in your possession (5 initially)</p>
            <p>A history of your performance in past periods this round</p>
          </div>
        </div>
      </div>
    );
  }
}
