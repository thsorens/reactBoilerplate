import thunk from 'redux-thunk';
import DevTools from 'DevTools';
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import testReducer from 'components/testReducer';
import { routeParamsReducer } from 'routeParams';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import userReducer from './userReducer';

const enhancer = compose(
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(browserHistory)),
  DevTools.instrument()
);

const rootReducer = combineReducers({
  test: testReducer,
  routing: routeParamsReducer,
  user: userReducer
});

const app = createStore(rootReducer, enhancer);

export default app;