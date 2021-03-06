import React, { Component } from 'react';
import './Consent.css';
import history from '../history';
import Button from 'material-ui/Button';

class Consent extends Component {
  render() {
    return (
      <div className="consent">
        <h2>INFORMED CONSENT</h2>

        <p> Welcome! Please give you consent to participate in this projct: </p>
        <p>Name of the university: UPF</p>

        <p>I HEREBY CONFIRM THAT: </p>
        <p>I give my consent to participate in the current project.</p>

        <Button raised onClick={ () => history.replace('/instructions')}> AGREE </Button>
      </div>
    );
  }
}

export default Consent;
