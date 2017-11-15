import React from 'react';
import ReactDOM from 'react-dom';
import {getRankOfUser, getRanks, getChanges, getPortfolioValues, currentPosition, canMakeOffer, getTotalPortfolio, getPortfolio, getCurrentPrice, getPortfolioChange, getOpenOrders, getMatches, getCleared} from './OrderCalcs';
import _ from 'lodash';
import Immutable from 'immutable';

function makeOrders(tuples) {
  return tuples.map(v => _.zipObject(['type', 'amount', 'timestamp', 'user', 'round', 'game'], v))
};

describe('getTotalPortfolio', () => {

  it('works with empty array', () => {
    const dividends = [];
    const orders = []
    const p = getTotalPortfolio(dividends, orders, 'foo', [2, 3.00]);
    expect(p).toEqual([2, 3.00]);
  });

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


describe('getRankOfUser', () => {
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
    expect(getRankOfUser(0, dividends, orders, 'foo', [1, 1.00])).toEqual(2)
    expect(getRankOfUser(0, dividends, orders, 'bar', [1, 1.00])).toEqual(1)

  });

});


describe('getRanks', () => {
  it('returns unsorted values', () => {
    const vals = [2,5,3];
    const users = ['foo', 'bar', 'baz'];
    expect(getRanks(vals, users)).toEqual([3,1,2])
  })
  it('returns sorted values', () => {
    const vals = [2,3,4];
    const users = ['foo', 'bar', 'baz'];
    expect(getRanks(vals, users)).toEqual([3,2,1])
  })
  it('allows for ties', () => {
    const vals = [2,3,3];
    const users = ['foo', 'bar', 'baz'];
    expect(getRanks(vals, users)).toEqual([2,1,1])
  })
  it('works with empty arrays', () => {
    const vals = [];
    const users = [];
    expect(getRanks(vals, users)).toEqual([])
  })
});


describe('getChanges', () => {
  it('gets good percentage changes', () => {
    const arr = [1,2,2,1.5];
    expect(getChanges(arr, 1)).toEqual([0, 1, 0, -.25])
  })

  it('works with empty arrays', () => {
    const arr = [];
    expect(getChanges(arr, 1)).toEqual([])
  })
  it('handles infinite growth', () => {
    const arr = [1];
    expect(getChanges(arr, 0)).toEqual([0])
  })
});



describe('getCurrentPrice', () => {
  it('it ignore same-user transactions', () => {
    const orders = makeOrders([
      ['bid', .90, 170, 'foo'],
      ['bid', 1.50, 170, 'foo'],
      ['bid', 1.00, 150, 'foo'],
      ['ask', 1.20, 100, 'foo'],
      ['ask', 1.10, 120, 'foo'],
      ['ask', 1.00, 160, 'foo']
    ]);
    const price = getCurrentPrice(orders, 0)
    expect(price).toEqual(0)
  });
  it('gets the last cleared price of the asset', () => {
    const orders = makeOrders([
      ['bid', .90, 170, 'foo'],
      ['bid', 1.50, 170, 'foo'],
      ['bid', 1.00, 150, 'foo'],
      ['ask', 1.20, 100, 'bar'],
      ['ask', 1.10, 120, 'bar'],
      ['ask', 1.00, 160, 'bar']
    ]);
    const price = getCurrentPrice(orders)
    expect(price).toEqual(1.10)
  });

  it('returns its default if no current price', () => {
    const orders = makeOrders([
      ['ask', 1.20, 100, 'foo'],
      ['ask', 1.10, 120, 'foo'],
      ['ask', 1.00, 160, 'bar']
    ]);
    const price = getCurrentPrice(orders, .5);
    expect(price).toEqual(.5);
  });
});

describe('canMakeOffer', () => {
  it('does not let make bid if not enough money', () => {
    const orders = makeOrders([
      ['bid', 1.00, 100, 'foo']
    ]);
    expect(canMakeOffer(orders[0], [5, 0.50])).toEqual(false);
    expect(canMakeOffer(orders[0], [5, 1.00])).toEqual(true);
  });

  it('does not let make bid if not enough money', () => {
    const orders = makeOrders([
      ['ask', 1.00, 100, 'foo']
    ]);
    expect(canMakeOffer(orders[0], [5, 0.50])).toEqual(true);
    expect(canMakeOffer(orders[0], [0, 0.50])).toEqual(false);
  });
});


describe('currentPosition', () => {
  it('calculates outstanding bids against cash', () => {
    const orders = makeOrders([
      ['bid', 0.50, 150, 'foo', 1],
      ['bid', 1.00, 120, 'foo', 1],
      ['bid', 1.00, 120, 'bar', 1],
      ['bid', 1.10, 120, 'foo', 0]
    ]);
    const pos = currentPosition(1, [.5], orders, 'foo', [1, 2.0]);
    expect(pos).toEqual([1, 1.0])
  });

  it('calculates outstanding asks against stock', () => {
    const orders = makeOrders([
      ['ask', 1.00, 120, 'foo', 1],
      ['ask', 1.00, 120, 'foo', 1],
      ['bid', 1.00, 120, 'foo', 0],
      ['ask', 1.00, 120, 'bar', 0]
    ]);
    const pos = currentPosition(1, [.5], orders, 'foo', [1, 2.0]);
    expect(pos).toEqual([0, 2])
  });
});


describe('getPortfolio', () => {

  it('ignores orders from practice round', () => {
    const orders = makeOrders([
      ['bid', 1.20, 150, 'foo', -1],
      ['ask', 1.10, 120, 'bar', -1]
    ]);
    const newPortfolio = getPortfolio(orders, 'foo', [5, 5.00]);
    expect(newPortfolio).toEqual([5, 5.00]);
  });

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


  it('gives a low ask to the highest bid', () => {
    const orders = makeOrders([
      ['bid', 1.50, 100],
      ['bid', 1.20, 110],
      ['ask', .10, 180]
    ]);

    const cleared = getCleared(orders);
    expect(cleared.length).toEqual(1)
    expect(cleared[0].filter(o => o.type == 'bid')[0].amount).toEqual(1.5)
  });
});

describe('getMatches', () => {

  it('gets multiple matches for one good bid', () => {
    const orders = makeOrders([
      ['bid', 1.20, 566],
      ['ask', 1.20, 500],
      ['ask', 1.10, 900],
      ['ask', 1.50, 900]
    ]);

    const matches = getMatches(orders[0], orders.slice(1))
    expect(matches.length).toEqual(2)
    expect(matches.filter(o => o.type === 'ask').length).toEqual(2)
  });


  it('gets multiple matches for one good ask', () => {
    const orders = makeOrders([
      ['ask', 1.20, 566],
      ['bid', 1.20, 500],
      ['bid', 1.10, 900],
      ['bid', 1.50, 900]
    ]);
    const matches = getMatches(orders[0], orders.slice(1))
    expect(matches.length).toEqual(2)
    expect(matches.filter(o => o.type === 'bid').length).toEqual(2)
  });
});
