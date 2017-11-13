import React, { Component } from 'react';

import List, {
  ListItem,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';

import './Portfolio.css';

class Portfolio extends Component {
  render() {
    return (
      <div className="portfolio">
        <p> Cash: {this.props.cash} </p>
        <p> Stocks: {this.props.assets} </p>
      </div>
    );
  }
}

export default Portfolio;
