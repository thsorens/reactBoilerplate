import TestService from 'services';

export const ADD_ONE_TO_COUNTER = "ADD_ONE_TO_COUNTER";
export const SUBTRACT_ONE_FROM_COUNTER = "SUBTRACT_ONE_FROM_COUNTER";
export const NUMBER_ADDED_TO_COUNTER = "NUMBER_ADDED_TO_COUNTER";
export const SOME_ASYNC_OPERATION_SUCCESS = "SOME_ASYNC_OPERATION_SUCCESS";
export const SOME_ASYNC_OPERATION_FAILED = "SOME_ASYNC_OPERATION_FAILED";

export function addNumber(numberToAdd){
  return {
    type: NUMBER_ADDED_TO_COUNTER,
    numberToAdd
  }
}

export function addOne(){
  return{
    type: ADD_ONE_TO_COUNTER
  };
}

export function subtractOne(){
  return{
    type: SUBTRACT_ONE_FROM_COUNTER
  };
}

export function someAsyncAction(){
  return(dispatch, getState) => {
    //this is a thunk, here you can send several dispatches or access the current store state by calling getState()
    //ex: 
    TestService.getTest(getState().test.value).then(res => {
      //call was a succes, dispatch an action to update some store
      dispatch({type: SOME_ASYNC_OPERATION_SUCCESS, result: res})
    }).catch(err => {
      //call wass a failure, dispatch an action to update som store
      dispatch({type: SOME_ASYNC_OPERATION_FAILED, error: err});
    })
  }
}