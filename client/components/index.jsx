import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {addNumber, subtractOne, addOne} from './actions';
import Summary from './summary';

@connect(
  null,
  dispatch => ({
    addNumber: (numberToAdd) => dispatch(addNumber(numberToAdd)),
    addOne: () => dispatch(addOne()),
    subtractOne: () => dispatch(subtractOne())
  })
)
export default class TestExample extends Component {
  constructor(props){
    super(props);
    this.state = {
      numberToAdd: ""
    }
  }
  static propTypes = {
    addNumber: PropTypes.func.isRequired,
    addOne: PropTypes.func.isRequired,
    subtractOne: PropTypes.func.isRequired
  };
  render(){
    return(
      <div>
        <input type="text" onChange={(ev) => this.setState({numberToAdd: ev.target.value})} value={this.state.numberToAdd} />

        <button type="button" onClick={() => this.props.addNumber(this.state.numberToAdd)}>Add input number</button>

        <button type="button" onClick={() => this.props.addOne()}>+</button>
        <button type="button" onClick={() => this.props.subtractOne()}>-</button>

        <Summary />

        <h3>Hit ctrl + h to open the redux-event-log</h3>

      </div>
    );
  }
}