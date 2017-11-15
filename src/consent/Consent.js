import React, { Component } from 'react';
import './Consent.css';
import history from '../history';
import Button from 'material-ui/Button';

class Consent extends Component {
  render() {
    return (
      <div className="consent">
        <h2>INFORMED CONSENT</h2>

      <h3>Name of the university: UPF</h3>

      <h3>I HEREBY CONFIRM THAT: </h3>
        <p>I give my consent to participate in the current project.</p>

        <Button raised onClick={ () => history.replace('/instructions')}> AGREE </Button>
      </div>
    );
  }
}

export default Consent;
