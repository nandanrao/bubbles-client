 import React, { Component } from 'react';
import {store} from '../store';
import Review from './Review';
import './Timeline.css';


class Timeline extends Component {

  render() {

    return (
      <div className="timeline">
        <Review user={this.props.user} orders={this.props.orders} game={this.props.game} round={this.props.round} dividends={this.props.dividends} />
      </div>
    )
  }
}


export default Timeline;
