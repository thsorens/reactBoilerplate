import matchRoutes from 'react-router/lib/matchRoutes';
import { createRoutes } from 'react-router';

export const UPDATE_LOCATION_WITH_PARAMS = "@@router/UPDATE_LOCATION_WITH_PARAMS";
export const GO_BACK = "GO_BACK";
export * from 'react-router-redux'

const initialState = {
  location: null,
  params: {},
  history: []
}

export function syncParams(store, routes, history) {
  const routesArray = createRoutes(routes)
  return history.listen(location => {
    matchRoutes(routesArray, location, (error, state) => {
      if (!error) {
        store.dispatch({
          type: UPDATE_LOCATION_WITH_PARAMS,
          payload: {
            location: location,
            params: state ? state.params : {}
          }
        })
      }
    })
  })
}

export function routeParamsReducer(state = initialState, { type, payload }) {
  if (type === UPDATE_LOCATION_WITH_PARAMS) {
    return {
      ...state,
      location: payload.location,
      params: payload.params,
      history: [...state.history, payload.location.pathname]
    }
  }
  if(type === GO_BACK){
    const history = state.history;
    let index = 0;
    if(history.length > 0){
      index = history.length - 1;
    }
    return Object.assign({}, state, {
      history: [...state.history.slice(0, index), ...state.history.slice(index + 1)]
    });    
  }
  return state
}