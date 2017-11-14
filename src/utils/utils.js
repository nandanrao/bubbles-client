import _ from 'lodash';

function getRoundTimes(game) {
  const trueStart = game.startTime + game.conf.waitTime
  return _.range(game.conf.rounds).map(i => trueStart + game.conf.roundTime*i)
}

export function getRound(game) {
  if (!game) return null;
  const rounds = getRoundTimes(game)
  const now = Date.now()
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
  if (!game || !game.conf || isPractice(game)) {
    return null
  }
  const round = getRound(game);
  if (round+1 < game.conf.rounds) {
    end = getRoundTimes(game)[round+1]
  } else {
    end = game.endTime
  }
  const left = (end - Date.now())/1000
  return left > 0 ? Math.round(left) : 0;
}

export function isPractice(game) {
  return getRound(game) === -1
}

export function formatMoney(num) {
  return '$' + (parseFloat(num*100)/100).toFixed(2)
}
