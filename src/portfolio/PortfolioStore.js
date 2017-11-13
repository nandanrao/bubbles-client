import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import {AppDispatcher, dispatch} from '../AppDispatcher';

class PortfolioStore extends ReduceStore {

  getInitialState() {
    return Immutable.OrderedMap([{}])
  }

  reduce (state, action) {
    switch (action.type) {

    case 'portfolio/update'
      return state

    default:
      return state;
    }
  }
}


// Export a singleton instance of the store
const instance = new PortfolioStore(AppDispatcher);
export default instance;
