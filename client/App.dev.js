import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import DevTools from './DevTools';
import {Provider} from 'react-redux';
import routes from 'routes';
import 'styles/Site.scss';
import {syncParams} from 'routeParams';
import store from 'reducers';

syncParams(store, routes, browserHistory);

render(
    <Provider store={store}>
      <div>
        <Router history={browserHistory}>
          {routes}  
        </Router>
        <DevTools/>      
      </div>
    </Provider>,
  document.querySelector("#pageContainer")
);
