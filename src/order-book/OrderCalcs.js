import _ from 'lodash';

function getPrice(pair) {
  return _.find(pair, o => o.type === 'ask').amount;
};

function getTime(pair) {
  return _.max(pair.map(o => o.timestamp));
};

function sumChanges([a1,c1], [a2,c2]) {
  return [a1+a2, c1+c2];
};

export function getCurrentPrice(orders, def = undefined) {
  const latest = _.sortBy(getCleared(orders), p => -getTime(p))[0];
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
    befores.sort((a,b) => a.amount - b.amount)
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
