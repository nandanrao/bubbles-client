import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import './Submit.css';
import NumberFormat from 'react-number-format';
import Input from 'material-ui/Input';

class Moneyz extends React.Component {
  render() {
    return (
      <NumberFormat
      {...this.props}
        onValueChange={values => {
          this.props.onChange({
            target: {
              value: values.value,
            },
          });
        }}
      />
    );
  }
};

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
        <Input
          placeholder="Amount"
          onChange = { this._onChange }
          inputComponent={Moneyz}
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
