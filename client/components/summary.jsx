import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({
    value: state.test.value
  })
)
export default class Summary extends Component{
  static propTypes = {
    value: PropTypes.number
  };
  render(){
    return(
      <h1>{this.props.value}</h1>
    );
  }
}