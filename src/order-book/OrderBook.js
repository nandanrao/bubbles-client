import React, { Component } from 'react';
import List, {
  ListItem,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';

import Divider from 'material-ui/Divider';
import SubmitOrder from './Submit';
import _ from 'lodash';
import './OrderBook.css';

function formatMoney(num) {
  return '$' + (parseFloat(num*100)/100).toFixed(2)
}

class OrderBook extends Component {

  render() {
    const marketOrder = order => [order.type === 'bid' ? 'ask' : 'bid', order.amount];

    const makeOrder = (order,key,arr) => {
      return <div key={key}>
        <ListItem button onClick={() => this.props.submit(...marketOrder(order))}>
        <ListItemText primary={formatMoney(order.amount)} />
        </ListItem>
        <Divider />
        </div>
    }

    const bids = _(this.props.orders)
          .filter(order => order.type === 'bid')
          .sortBy(order => -order.amount)
          .map(makeOrder)
          .value();

    const asks = _(this.props.orders)
          .filter(order => order.type === 'ask')
          .sortBy(order => order.amount)
          .map(makeOrder)
          .value();


    return (
      <div className="orderBook">
        <div className="orders">
          <List className="bids" subheader={<ListSubheader> Bids </ListSubheader>} >
            {bids}
          </List>
          <List className="asks" subheader={<ListSubheader> Asks </ListSubheader>}>
            {asks}
          </List>
        </div>
        <div className="submissions">
          <SubmitOrder submit={this.props.submit} type="bid"/>
          <SubmitOrder submit={this.props.submit} type="ask"/>
        </div>
      </div>
    );
  }
}

export default OrderBook;
