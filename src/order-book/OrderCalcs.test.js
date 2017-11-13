import React from 'react';
import ReactDOM from 'react-dom';
import {getTotalPortfolio, getPortfolio, getCurrentPrice, getPortfolioChange, getOpenOrders, getMatches, getCleared} from './OrderCalcs';
import _ from 'lodash';
import Immutable from 'immutable';

function makeOrders(tuples) {
  return tuples.map(v => _.zipObject(['type', 'amount', 'timestamp', 'user', 'round', 'game'], v))
};

describe('getTotal', () => {

  it('gets the assets plus dividends', () => {
    const dividends = [1.5, 3.5];
    const orders = makeOrders([
      ['bid', 0.90, 170, 'foo', 1],
      ['bid', 1.50, 170, 'foo', 1],
      ['ask', 1.00, 160, 'bar', 1],
      ['bid', 1.20, 120, 'foo', 0],
      ['ask', 1.10, 120, 'bar', 0],
      ['ask', 1.20, 100, 'bar', 0]
    ]);
    const p = getTotalPortfolio(dividends, orders, 'foo', [2, 3.00]);
    const tots = 3.00 - 1.10 + 3*1.5 - 1.00 + 4*3.5;
    expect(p).toEqual([4, tots]);
  });

  it('gets just assets if no dividends yet', () => {
    const dividends = [];
    const orders = makeOrders([
      ['ask', 1.00, 160, 'bar', 0],
      ['bid', 1.20, 120, 'foo', 0],
      ['ask', 1.10, 120, 'bar', 0],
      ['ask', 1.20, 100, 'bar', 0]
    ]);
    const p = getTotalPortfolio(dividends, orders, 'foo', [2, 3.00]);
    expect(p).toEqual([3, 3.00 - 1.10]);
  });

});


describe('getCurrentPrice', () => {
  it('gets the last cleared price of the asset', () => {
    const orders = makeOrders([
      ['bid', .90, 170],
      ['bid', 1.50, 170],
      ['bid', 1.00, 150],
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);
    const price = getCurrentPrice(orders)
    expect(price).toEqual(1.10)
  });

  it('returns its default if no current price', () => {
    const orders = makeOrders([
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);
    const price = getCurrentPrice(orders, .5);
    expect(price).toEqual(.5);
  });
});


describe('getPortfolio', () => {
  it('gets portfolio even if same user is on both sides of transaction', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'foo']
    ]);
    const newPortfolio = getPortfolio(orders, 'foo', [5, 5.00]);
    expect(newPortfolio).toEqual([5, 5.00]);
  });

  it('gets users current portfolio from winning bid', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar']
    ]);
    const newPortfolio = getPortfolio(orders, 'foo', [5, 5.00]);
    expect(newPortfolio).toEqual([6, 3.90]);
  });

  it('calculates a negative portfolio in shares', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar'],
      ['bid', 1.30, 170, 'foo'],
      ['ask', 1.00, 160, 'bar']
    ]);
    const newPortfolio = getPortfolio(orders, 'bar', [1, 5.00]);
    expect(newPortfolio).toEqual([-1, 7.10]);
  });

  it('calculates a negative portfolio in cash', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar'],
      ['bid', 1.30, 170, 'foo'],
      ['ask', 1.00, 160, 'bar']
    ]);
    const newPortfolio = getPortfolio(orders, 'foo', [1, 1.00]);
    expect(newPortfolio).toEqual([3, -1.10]);
  });

  it('calculates correctly even if no user', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar']
    ]);
    const newPortfolio = getPortfolio(orders, 'baz', [1, 1.00]);
    expect(newPortfolio).toEqual([1, 1.00]);
  });
});


describe('getPortfolioChange', () => {
  it('gets the change for one user', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar']
    ]);
    const cleared = getCleared(orders);
    const change = getPortfolioChange(cleared[0], 'foo');
    expect(change).toEqual([1, -1.1])
  });

  it('returns 0\'s if no user', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo'],
      ['ask', 1.10, 120, 'bar']
    ]);
    const cleared = getCleared(orders);
    const change = getPortfolioChange(cleared[0], 'baz');
    expect(change).toEqual([0, 0])
  });
});


describe('getOpenOrders', () => {
  it('gets open orders when there are some', () => {
    const orders = makeOrders([
      ['bid', .90, 150, 'foo', 0],
      ['bid', 1.20, 150, 'foo', 0],
      ['ask', 1.20, 100, 'foo', 0],
      ['ask', 1.10, 120, 'foo', 0],
      ['ask', 1.00, 160, 'foo', 0]
    ]);
     const open = getOpenOrders(orders, 0)
    expect(open.length).toEqual(3)
  });

  it('excludes open orders from past rounds', () => {
    const orders = makeOrders([
      ['bid', .90, 150, 'foo', 1],
      ['bid', 1.20, 150, 'foo', 0],
      ['ask', 1.20, 100, 'foo', 0],
      ['ask', 1.10, 120, 'foo', 0],
      ['ask', 1.00, 160, 'foo', 0]
    ]);
    const open = getOpenOrders(orders, 1)
    expect(open.length).toEqual(1)
  });

  it('gets open orders when there are none', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo', 0],
      ['ask', 1.10, 120, 'foo', 0],
    ]);
    const open = getOpenOrders(orders, 0)
    expect(open.length).toEqual(0)
  });
});

describe('getCleared', () => {

  it('does not clear orders from different rounds', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo', 1],
      ['ask', 1.20, 100, 'bar', 0]
    ]);
    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(0);
  });

  it('returns cleared orders bid after ask', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150],
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);
    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(1)
    expect(cleared[0].filter(o => o.type == 'ask')[0].amount).toEqual(1.1)
  });

  it('returns cleared orders ask after bid', () => {
    const orders = makeOrders([
      ['bid', 1.00, 150],
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);

    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(1)
    expect(cleared[0].filter(o => o.type == 'ask')[0].amount).toEqual(1.0)
  });


  it('returns multiple cleared orders, both bid before ask and vice versa', () => {

    const orders = makeOrders([
      ['bid', .90, 170],
      ['bid', 1.50, 170],
      ['bid', 1.00, 150],
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);


    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(2)
    expect(cleared[0].filter(o => o.type == 'ask')[0].amount).toEqual(1.0)
    expect(cleared[0].filter(o => o.type == 'bid')[0].amount).toEqual(1.0)
    expect(cleared[1].filter(o => o.type == 'ask')[0].amount).toEqual(1.1)
    expect(cleared[1].filter(o => o.type == 'bid')[0].amount).toEqual(1.5)
  });

  it('returns cleared orders ask > bid after', () => {
    const orders = makeOrders([
      ['bid', 1.00, 150],
      ['ask', 1.20, 100],
      ['ask', 1.10, 120],
      ['ask', 1.00, 160]
    ]);

    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(1)
    expect(cleared[0].filter(o => o.type == 'ask')[0].amount).toEqual(1.0)
  });
});

describe('getMatches', () => {

  it('gets multiple matches for one good bid', () => {
    const orders = [
      {
        type: 'bid',
        amount: 1.20,
        timestamp: 1510083196566
      },
      {
        type: 'ask',
        amount: 1.20,
        timestamp: 1510083196500
      },
      {
        type: 'ask',
        amount: 1.10,
        timestamp: 1510083196900
      },
      {
        type: 'ask',
        amount: 1.50,
        timestamp: 1510083196900
      }
    ];
    const matches = getMatches(orders[0], orders.slice(1))
    expect(matches.length).toEqual(2)
    expect(matches.filter(o => o.type === 'ask').length).toEqual(2)
  });


  it('gets multiple matches for one good ask', () => {
    const orders = [
      {
        type: 'ask',
        amount: 1.20,
        timestamp: 1510083196566
      },
      {
        type: 'bid',
        amount: 1.20,
        timestamp: 1510083196500
      },
      {
        type: 'bid',
        amount: 1.10,
        timestamp: 1510083196900
      },
      {
        type: 'bid',
        amount: 1.50,
        timestamp: 1510083196900
      }
    ];
    const matches = getMatches(orders[0], orders.slice(1))
    expect(matches.length).toEqual(2)
    expect(matches.filter(o => o.type === 'bid').length).toEqual(2)
  });
});
