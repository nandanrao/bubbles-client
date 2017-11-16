import React, { Component } from 'react';
import Button from 'material-ui/Button';
import history from './history';

export default class Error extends Component {
  render() {
    return (
      <div className="error">
        <p>
          There was a problem with Login. Did you use your UPF email address? Please try again!
        </p>
        <Button raised onClick={ () => window.location.assign('/') }> Return </Button>
      </div>
    );
  }
}
