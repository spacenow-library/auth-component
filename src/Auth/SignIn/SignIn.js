import React, { Component } from 'react';
import './SignIn.css';

import { Auth, Logger, JS } from 'aws-amplify';

const logger = new Logger('Sign In');

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.checkContact = this.checkContact.bind(this);
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

  signIn() {
    const { username, password } = this.inputs;
    logger.info('sign in with ' + username);
    Auth.signIn(username, password)
      .then(user => this.signInSuccess(user))
      .catch(err => this.signInError(err));
  }
  
  signInSuccess(user) {
    logger.info('sign in success', user);
    this.setState({ error: '' });
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      this.changeState('confirmSignIn', user);
    } else {
      this.checkContact(user);
    }
  }

  signInError(err) {
    logger.info('sign in error', err);
    this.setState({ error: err || err });
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      });
  }

  render() {
    const { authState, authData } = this.props;
    if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }
    const { error } = this.state;

    return (
      <div className={`container`}>
        <div className={`formGroup form-group`}>
          <label className={`label`}>Username or email address</label>
          <input className={`input form-control`} type="text" name={`username`} placeholder="Username or email address" defaultValue={authData || '' } onChange={event => this.inputs.username = event.target.value}  autoFocus />
        </div>
        <div className={`formGroup form-group`}>
          <label className={`label`}>Password</label>
          <input className={`input form-control`} type="password" name={`password`} placeholder="Password" onChange={event => this.inputs.password = event.target.value} autoFocus />
        </div>
        <div className="form-row">
          <div className="col">
            New to us?{' '}
            <button className={`btn btn-primary`} onClick={() => this.changeState('signUp')}>
              Sign Up
            </button>
          </div>
          <div className="col">
            <button className={`btn btn-primary`} onClick={() => this.changeState('forgotPassword')}>
              Forgot Password
            </button>
          </div>
        </div>
        <button className={`btn btn-primary`} onClick={this.signIn}>
          Sign in
        </button>
        { error && <div className={`alert alert-danger`} role="alert">{error}</div>}
      </div>
    )
  }
}

export default SignIn;
