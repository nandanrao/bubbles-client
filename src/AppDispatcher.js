import {Dispatcher} from 'flux';

export const AppDispatcher = new Dispatcher();
export const dispatch = AppDispatcher.dispatch.bind(AppDispatcher);
