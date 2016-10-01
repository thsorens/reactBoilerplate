import React, {PropTypes} from 'react';

module.exports = React.createClass({
  propTypes:{
    children: PropTypes.any
  },
  render() {
    return (
      <div>
        <div className="header">
          <div className="container">
            Header
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
});