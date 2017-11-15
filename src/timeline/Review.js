import React, { Component } from 'react';
import { getRound, activeGame, timeLeftInRound} from '../utils/utils';
import {store} from '../store';
import Review from './Review';
import './Timeline.css';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import _ from 'lodash';
import { getRankOfUser, getPortfolioValues, getChanges, getCurrentPrice, getTotalPortfolio } from '../order-book/OrderCalcs';
import { initialPortfolio } from '../constants';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

function computeRound(round) {
  if (round === null) return 'PRACTICE'
  return round + 1
}

class Timeline extends Component {

  render() {

    const portfolioValues = getPortfolioValues(this.props.dividends, this.props.orders, this.props.user._id, initialPortfolio);
    const changes = getChanges(portfolioValues, initialPortfolio[1]);

    const gains = _.zip(this.props.dividends, portfolioValues, changes)
          .map(([d,v,c], i) => {

            const orders = this.props.orders.filter(o => o.round <= i);
            const p = getTotalPortfolio(this.props.dividends.slice(0,i+1), orders, this.props.user._id, initialPortfolio );
            const rank = getRankOfUser(i, this.props.dividends, this.props.orders, this.props.user._id, initialPortfolio);

            return (
              <TableRow key={i}>
                <TableCell numeric>{i+1}</TableCell>
                <TableCell numeric>{d}</TableCell>
                <TableCell numeric>{p[0]}</TableCell>
                <TableCell numeric>{(p[0]*d).toFixed(2)}</TableCell>
                <TableCell numeric>{v.toFixed(2)}</TableCell>
                <TableCell numeric>{(c*100).toFixed(2) + '%'}</TableCell>
                <TableCell numeric>{rank}</TableCell>
              </TableRow>
            );
          })

    const treated = () => {
      return (
        <Paper className="review treated">
          <Typography type="headline" component="h2">
            Past Portfolio Performance:
          </Typography>
          <Table className="review-table">
            <TableHead>
              <TableRow>
                <TableCell numeric> Round </TableCell>
                <TableCell numeric> Dividend </TableCell>
                <TableCell numeric> Stocks </TableCell>
                <TableCell numeric> Earnings </TableCell>
                <TableCell numeric> Portfolio Value </TableCell>
                <TableCell numeric> Percentage Change </TableCell>
                <TableCell numeric> Rank </TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {gains}
              </TableBody>
          </Table>
        </Paper>
      )
    }

    const returns = this.props.dividends.map((d,i) => {
      const orders = this.props.orders.filter(o => o.round <= i);
      const p = getTotalPortfolio(this.props.dividends.slice(0,i+1), orders, this.props.user._id, initialPortfolio );
      return (
        <TableRow key={i}>
          <TableCell numeric>{i+1}</TableCell>
          <TableCell numeric>{d}</TableCell>
          <TableCell numeric>{p[0]}</TableCell>
          <TableCell numeric>{(p[0]*d).toFixed(2)}</TableCell>
        </TableRow>
      )
    })

    const control = () => {
      return (
        <Paper className="review control">
          <Typography type="headline" component="h2">
            Past Dividends:
          </Typography>
          <Table className="review-table">
            <TableHead>
              <TableRow>
                <TableCell numeric> Round </TableCell>
                <TableCell numeric> Dividend </TableCell>
                <TableCell numeric> Stocks </TableCell>
                <TableCell numeric> Earnings </TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {returns}
              </TableBody>
          </Table>
        </Paper>
      )
    }

    return this.props.game.treated ? treated() : control();
  }
}


export default Timeline;
