import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Layout from 'Layout';
import Index from 'components';

const routes = (
  <Route name="ROOT" component={Layout} path="/"  >
    <Route name="root" path="/" component={Index} />
    <IndexRoute component={Index} />
  </Route>
);

export default routes;