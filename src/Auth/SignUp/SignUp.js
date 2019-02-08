import React, { Component } from 'react';
import './SignUp.css';

import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('Sign Up');

class SignUp extends Component {
  
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { error: '' }
  }

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  signUp() {
    const { username, password, email, phone_number } = this.inputs;
    logger.info('sign up with ' + username);
    Auth.signUp(username, password, email, phone_number)
      .then(() => this.signUpSuccess(username))
      .catch(err => this.signUpError(err));
  }

  signUpSuccess(username) {
    logger.info('sign up success with ' + username);
    this.setState({ error: '' });
    this.changeState('confirmSignUp', username);
  }

  signUpError(err) {
    logger.info('sign up error', err);
    let message = err.message || err;
    if (message.startsWith('Invalid phone number')) {
      message = 'Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.'
    }
    this.setState({ error: message });
  }

  render() {

    const { authState } = this.props;
    const { error } = this.state;

    if (authState !== 'signUp') { return null; }

    return (
      <div className={`container`}>
        <h1>{this.props.title}</h1>
          <div className={`form-group`}>
            <label className={`form-check-label`}>Username</label>
            <input className={`form-control`} type="text" placeholder="Username" onChange={event => this.inputs.username = event.target.value} autoFocus />
          </div>

          <div className={`form-group`}>
            <label className={`form-check-label`}>Password</label>
            <input className={`form-control`} type="password" placeholder="Password" onChange={event => this.inputs.password = event.target.value} autoFocus />
          </div>

          <div className={`form-group`}>
            <label className={`form-check-label`}>Email</label>
            <input className={`form-control`} type="email" placeholder="Email address" onChange={event => this.inputs.email = event.target.value} autoFocus />
          </div>

          <div className={`form-group`}>
            <label className={`form-check-label`}>Phone</label>
            <input className={`form-control`} type="tel" placeholder="Phone number" onChange={event => this.inputs.phone_number = event.target.value} autoFocus />
          </div>

          <div className="form-row">
            <div className="col">
              <button className={`btn btn-primary`} onClick={() => this.changeState('signIn')}>
                Back to sign in
              </button>
            </div>
            <div className="col">
              <button className={`btn btn-primary`} onClick={() => this.changeState('confirmSignUp')}>
                Confirm a code
              </button>
            </div>
          </div>
          <button className={`btn btn-primary`} onClick={this.signUp}>
            Create account
          </button>
          { error && <div className="alert alert-danger" role="alert">{error}</div> }
      </div>
    );
  }
}

export default SignUp;