import _ from 'lodash';

function getRoundTimes(game) {
  const trueStart = game.startTime + game.conf.waitTime
  return _.range(game.conf.rounds).map(i => trueStart + game.conf.roundTime*i)
}

export function getRound(game) {
  if (!game) return null;

  const now = Date.now();
  const rounds = getRoundTimes(game);

  if (now > (rounds[rounds.length - 1] + game.conf.wrapupTime)) {
    return Infinity
  }
  const round = _.takeWhile(rounds, t => now > t).length - 1
  return round;
}

export function activeGame(user) {
  if (!user.games || !user.games.length > 0) {
    return;
  }
  const now = Date.now();
  const g = user.games.filter(g => g.startTime < now && g.endTime > now);
  return g[0]
}

export function timeLeftInRound(game) {
  let end;
  if (!game || !game.conf) {
    return null
  }
  const round = getRound(game);
  if (round+1 < game.conf.rounds) {
    end = getRoundTimes(game)[round+1];
  } else {
    end = game.endTime - game.conf.wrapupTime;
  }
  const left = (end - Date.now())/1000
  return left > 0 ? Math.round(left) : 0;
}

export function isPractice(round) {
  return round === -1
}

export function isWrapup(round) {
  return round === Infinity
}

export function formatMoney(num) {
  return '$' + (parseFloat(num*100)/100).toFixed(2)
}

export function emptyDividends(game, dividends) {
  if (dividends.length === 0) return false;
  const round = getRound(game);
  return round <= 0 || round === null;
}

export function needDividends(game, dividends) {
  if (!game) return false;
  let round = getRound(game);
  round = round > game.conf.rounds ? game.conf.rounds : round
  return round > dividends.length;
}
