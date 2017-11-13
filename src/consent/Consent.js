import React, { Component } from 'react';
import './Consent.css';

class Consent extends Component {
  render() {
    return (
      <div className="consent">
        <button onClick={this.props.login}> I agree - login with Google </button>
      </div>
    );
  }
}

export default Consent;
