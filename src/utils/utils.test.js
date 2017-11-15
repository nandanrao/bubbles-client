import { getRound, timeLeftInRound } from './utils';
import _ from 'lodash';

const minutes = (i) => 1000 * 60 * i;

describe('getRound', () => {
  const conf = {
    roundTime: minutes(.5),
    waitTime: minutes(.5),
    wrapupTime: minutes(.5),
    rounds: 10
  }
  it('gets the round from the game during waiting', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.4)
    }
    expect(getRound(game)).toEqual(-1);
  });

  it('gets the round from the game while wrapup', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.4)
    }
    expect(getRound(game)).toEqual(-1);
  });
  it('gets the round from the game round 0 ', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.6)
    }
    expect(getRound(game)).toEqual(0);
  });
  it('gets the round from the middle of the game', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.5) - minutes(3.1)
    }
    expect(getRound(game)).toEqual(6);
  });
  it('never tells us wrapup', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.5) - minutes(6.1)
    }
    expect(getRound(game)).toEqual(Infinity);
  });
  it('never goes beyond wrapup', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.5) - minutes(999)
    }
    expect(getRound(game)).toEqual(Infinity);
  });
});

describe('timeLeftInRound', () => {
  const conf = {
    roundTime: minutes(.5),
    waitTime: minutes(.5),
    rounds: 10
  }
  it('gets time left before start', ()=> {
    const game = { conf, startTime: Date.now() - 5*1000}
    const left = timeLeftInRound(game)
    expect(left).toEqual(25)
  })
  it('gets time left in middle', ()=> {
    const game = { conf, startTime: Date.now() - minutes(.5) - 25*1000}
    const left = timeLeftInRound(game)
    expect(left).toEqual(5)
  })
  it('gets time left at end', ()=> {
    const game = { conf, startTime: Date.now() - minutes(.5) - minutes(6)}
    const left = timeLeftInRound(game)
    expect(left).toEqual(0)
  })
  it('manages malformed game object', ()=> {
    const game = { }
    const left = timeLeftInRound(game)
    expect(left).toEqual(null)
  })
});
