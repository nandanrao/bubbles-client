import _ from 'lodash';
import { isPractice } from '../utils/utils';

function getPrice(pair) {
  return _.find(pair, o => o.type === 'ask').amount;
};

function getTime(pair) {
  return _.max(pair.map(o => o.timestamp));
};

function sumChanges([a1,c1], [a2,c2]) {
  return [a1+a2, c1+c2];
};

export function getChanges(arr, initial) {
  return arr.map((v, i) => {
    const prev = arr[i-1] || initial;
    if (prev === 0) return 0; // WHAT????
    return (v - prev)/prev
  })
}

export function getRanks(vals, users){
  const sortedScores = _.uniq(_.sortBy(vals, o => -o))
  const both = _.zip(users, vals);
  return both.map(([u,v]) => sortedScores.indexOf(v) + 1);
}

export function getRankOfUser(round, dividends, orders, user, initialPortfolio) {
  const users = _.uniq(orders.map(o => o.user));
  let vals = users.map(u => {
    const vals = getPortfolioValues(dividends, orders, u, initialPortfolio);
    const changes = getChanges(vals, initialPortfolio[1]);
    return changes[round];
  });
  const i = users.indexOf(user);
  const rank = getRanks(vals, users)[i];
  return rank > 0 ? rank : 'N/A';
}

export function getPortfolioValues(dividends, orders, user, initialPortfolio) {
  return dividends.map((d,i) => {
    const ords = orders.filter(o => o.round <= i);
    const p = getTotalPortfolio(dividends.slice(0,i+1), ords, user, initialPortfolio);
    const price = getCurrentPrice(ords);
    return p[1] + p[0] * price
  })
}

export function getCurrentPrice(orders, def = 0) {
  const cleared = getCleared(orders).filter(([a,b]) => a.user !== b.user)
  const latest = _.sortBy(cleared, p => -getTime(p))[0];
  if (latest) return getPrice(latest);
  return def;
};

export function dividendsPerRound(dividends, orders, user, initialPortfolio, portfolio) {
  return dividends.map((d,i) => {
    const o = orders.filter(o => o.round <= i);
    return d * getPortfolio(o, user, initialPortfolio)[0];
  });
};

export function getTotalPortfolio(dividends, orders, user, initialPortfolio) {
  const p = getPortfolio(orders, user, initialPortfolio);
  const fromDividends = dividendsPerRound(dividends, orders, user, initialPortfolio, p)
        .reduce((a,b) => a + b, 0);
  return [p[0], p[1] + fromDividends];
}

export function getPortfolio(orders, user, initialPortfolio) {
  if (orders.length === 0) {
    return initialPortfolio;
  }
  orders = orders.filter(o => !isPractice(o.round));
  return getCleared(orders)
    .map(pair => getPortfolioChange(pair, user))
    .reduce(sumChanges, initialPortfolio);
}

export function getPortfolioChange(pair, user) {
  const price = getPrice(pair);

  return pair
    .filter(o => o.user === user)
    .map(o => o.type === 'bid' ? [1, -price] : [-1, price])
    .reduce(sumChanges, [0,0])
};

// TODO: filter by game???
export function getOpenOrders(orders, round) {
  const ordersThisRound = orders.filter(o => o.round === round);
  const cleared = _.flatten(getCleared(ordersThisRound))
  return _.without(ordersThisRound, ...cleared)
};

function clearAll(orders) {
  orders.sort((a,b) => a.timestamp - b.timestamp);
  let i = 0;
  const cleared = [];
  while (i < orders.length) {
    const order = orders[i];
    const match = getMatch(order, _.without(orders, order));
    if (match) {
      orders = _.without(orders, match, order);
      cleared.push([match, order]);
      i = 0; // just to be safe, restart from 0!
    } else { i++; };
  }
  return cleared;
};

export function getCleared(orders) {
  const rounds = _(orders).map(o => o.round).uniq().sortBy().value();
  return _(rounds)
    .map(i => orders.filter(o => o.round === i))
    .map(clearAll)
    .flatten()
    .value();
};

export function getMatch(order, orders) {
  const befores = getMatches(order, orders)
        .filter(o => o.timestamp <= order.timestamp)

  if (befores.length > 0) {
    befores.sort((a,b) => order.type === 'bid' ? a.amount - b.amount : b.amount - a.amount)
    return befores[0]
  }
}

export function getMatches(order, orders) {
  const otherType = order.type === 'bid' ? 'ask' : 'bid';
  const couldClear = order.type === 'bid' ?
        (order, other) => order.amount >= other.amount :
        (order, other) => order.amount <= other.amount

  return orders
        .filter(o => o.type === otherType)
        .filter(o => couldClear(order, o))
}

export function currentPosition(round, dividends, orders, user, initialPortfolio) {
  const portfolio = getTotalPortfolio(dividends, orders, user, initialPortfolio);
  const ords = getOpenOrders(orders, round).filter(o => o.user == user);

  const cashChange = ords
        .filter(o => o.type === 'bid')
        .map(o => o.amount)
        .reduce((a,b) => a+b, 0);

  const assetChange = ords
        .filter(o => o.type === 'ask')
        .map(o => 1)
        .reduce((a,b) => a+b, 0);

  return [portfolio[0] - assetChange, portfolio[1] - cashChange]
}


export function canMakeOffer(order, position) {
  if (order.type === 'bid') {
    return order.amount <= position[1]
  }
  if (order.type === 'ask') {
    return position[0] > 0
  }
}
