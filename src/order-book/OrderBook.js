import React, { Component } from 'react';
import List, {
  ListItem,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';
import {formatMoney} from '../utils/utils';
import Divider from 'material-ui/Divider';
import SubmitOrder from './Submit';
import _ from 'lodash';
import './OrderBook.css';
import NumberFormat from 'react-number-format';

class OrderBook extends Component {

  render() {
    const marketOrder = order => [order.type === 'bid' ? 'ask' : 'bid', order.amount];

    const makeOrder = (order,key,arr) => {
      return (key === 0 ?
              <div key={key}>
              <ListItem button onClick={() => this.props.submit(...marketOrder(order))}>
              <ListItemText className={'order-text ' + order.type} primary={formatMoney(order.amount)} />
              </ListItem>
              <Divider />
              </div> :
              <div key={key}>
              <ListItem >
              <ListItemText primary={formatMoney(order.amount)} />
              </ListItem>
              <Divider />
              </div>
)
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
          <List className="bids" subheader={<ListSubheader> Buying </ListSubheader>} >
            {bids}
          </List>
          <List className="asks" subheader={<ListSubheader> Selling </ListSubheader>}>
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
