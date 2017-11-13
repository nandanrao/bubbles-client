import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import './Submit.css';


class SubmitOrder extends Component {
  constructor(props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = { val: '' }
  }

  _onSubmit(e) {
    e.preventDefault();
    this.props.submit(this.props.type, this.state.val);
    this.state.val = '';
  };

  _onChange(e) {
    this.setState({ val: e.target.value })
  }

  render() {
    return (
      <form onSubmit={ this._onSubmit } className="submitOrder">
        {this.props.type + ': '}
        <TextField
          placeholder="Amount"
          onChange = { this._onChange }
          value={this.state.val}
          margin="normal"
          />
        <Button type="submit" raised>
          Submit
        </Button>
      </form>
    );
  }
}

export default SubmitOrder;
