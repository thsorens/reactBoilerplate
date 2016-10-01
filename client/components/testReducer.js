import {ADD_ONE_TO_COUNTER, NUMBER_ADDED_TO_COUNTER, SUBTRACT_ONE_FROM_COUNTER} from './actions';

const initialState = {value: 0};

export default function(state = initialState, action){
  switch(action.type){
    case ADD_ONE_TO_COUNTER: {
      return Object.assign({}, state, {value: state.value + 1});
    }
    case SUBTRACT_ONE_FROM_COUNTER: {
      return Object.assign({}, state, {value: state.value - 1});
    }
    case NUMBER_ADDED_TO_COUNTER: {
      const numberToAdd = parseInt(action.numberToAdd);
      return Object.assign({}, state, {value: state.value + numberToAdd});
    }
    default: {
      return state;
    }
  }
}