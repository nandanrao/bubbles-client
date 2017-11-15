import React, { Component } from 'react';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import {timeLeftInRound} from '../utils/utils';

import List, {
  ListItem,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';

import './Portfolio.css';

class Portfolio extends Component {
  render() {
    return (
        <Card className="portfolio">
          <CardContent className="content">
            <div> <span>Cash: </span> <span>{'$'+this.props.cash.toFixed(2)} </span></div>
            <div> <span>Stocks: </span><span> {this.props.assets} </span></div>
            <div> <span>Round: </span><span> {this.props.round+1 } / {this.props.game.conf.rounds} </span></div>
            <div> <span>Time Remaining: </span><span> {timeLeftInRound(this.props.game)} </span></div>
          </CardContent>
        </Card>
    );
  }
}

export default Portfolio;
