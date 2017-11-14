import { getRound, timeLeftInRound } from './utils';
import _ from 'lodash';

const minutes = (i) => 1000 * 60 * i;

describe('getRound', () => {
  const conf = {
    roundTime: minutes(.5),
    waitTime: minutes(.5),
    rounds: 10
  }
  it('gets the round from the game before', () => {
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
  it('never goes beyond last round', () => {
    const game = {
      conf,
      startTime: Date.now() - minutes(.5) - minutes(999)
    }
    expect(getRound(game)).toEqual(9);
  });

});

describe('timeLeftInRound', () => {
  const conf = {
    roundTime: minutes(.5),
    waitTime: minutes(.5),
    rounds: 10
  }
  it('gets time left before start', ()=> {
    const game = { conf, startTime: Date.now() - minutes(.2)}
    const left = timeLeftInRound(game)
    expect(left).toEqual(null)
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
})
