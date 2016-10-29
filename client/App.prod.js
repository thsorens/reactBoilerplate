import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from 'routes';
import 'styles/Site.scss';
import store from 'reducers';
import {syncParams} from 'routeParams';

syncParams(store, routes, browserHistory);

render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}  
      </Router>
    </Provider>,
  document.querySelector("#pageContainer")
);
