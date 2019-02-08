/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Auth, Logger } from 'aws-amplify';
import './ConfirmSignUp.css';

const logger = new Logger('Confirm Sign Up');

class ConfirmSignUp extends React.Component {

  constructor(props) {
    super(props);
    this.confirmSignUp = this.confirmSignUp.bind(this);
    this.resendCode = this.resendCode.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { message: '', error: '' }
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

  confirmSignUp() {
    const username = this.props.authData || this.inputs.username;
    const { code } = this.inputs;
    logger.info('confirm sign up with ' + code);
    Auth.confirmSignUp(username, code)
      .then(() => this.confirmSuccess(username))
      .catch(err => this.handleError(err));
  }

  resendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.resendSignUp(username)
      .then(() => this.setState({ message: 'Code sent' }))
      .catch(err => this.handleError(err));
  }

  confirmSuccess(username) {
    logger.info('confirm sign up success with ' + username);
    this.setState({ message: '', error: '' });
    this.changeState('signIn', username);
  }

  handleError(err) {
    logger.info('confirm sign up error', err);
    this.setState({ message: '', error: err.message || err });
  }

  render() {

    const { authState, authData } = this.props;
    if (authState !== 'confirmSignUp') { return null; }
    const { message, error } = this.state;

    return (
      <div className={`container`}>
        <h1>{this.props.title}</h1>
        <div className={`form-group`}>
          <label className={`form-check-label`}>Username</label>
          <input className={`form-control`} type="text" placeholder="Username" onChange={event => this.inputs.username = event.target.value} autoFocus disabled={!!authData}/>
        </div>

        <div className={`form-group`}>
          <label className={`form-check-label`}>Code</label>
          <input className={`form-control`} type="text" placeholder="Code" onChange={event => this.inputs.code = event.target.value} autoFocus />
        </div>

        <div className={`form-row`}>
          <div className={`col`}>
            <button className={`btn btn-primary`} onClick={() => this.changeState('signIn')}>
              Back to sign in
            </button>
          </div>
        </div>
        <div className={`form-row`}>
          <div className={`col`}>
            <button className={`btn btn-primary`} onClick={this.confirmSignUp}>
              Confirm
            </button>
          </div>
          <div className={`col`}>
            <button className={`btn btn-primary`} onClick={this.resendCode}>
              Resend Code
            </button>
          </div>
        </div>
        { message && <div className={`alert alert-success`} role={`alert`}>{message}</div> }
        { error && <div className={`alert alert-danger`} role={`alert`}>{error}</div> }
      </div>
    );
  }
}

export default ConfirmSignUp;