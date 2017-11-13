import _ from 'lodash';

function getRoundTimes(game) {
  const trueStart = game.startTime + game.conf.waitTime
  return _.range(game.conf.rounds).map(i => trueStart + game.conf.roundTime*i)
}

export function getRound(game) {
  const rounds = getRoundTimes(game)
  const now = Date.now()
  const round = _.takeWhile(rounds, t => now > t).length - 1
  return round >= 0 ? round : null;
}
