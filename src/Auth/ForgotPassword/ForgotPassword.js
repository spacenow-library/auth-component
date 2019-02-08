/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import './ForgotPassword.css';

import { Auth, Logger } from 'aws-amplify';
const logger = new Logger('Forgot Password');


class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.sendCode = this.sendCode.bind(this);
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

  sendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.forgotPassword(username)
      .then(data => this.sendSuccess(username, data))
      .catch(err => this.handleError(err));
  }

  sendSuccess(username, data) {
    logger.info('sent code for ' + username, data);
    this.changeState('forgotPasswordReset', username);
  }

  handleError(err) {
    logger.info('forgot password send code error', err);
    this.setState({ error: err.message || err });
  }

  render() {

    const { authState, authData } = this.props;
    if (authState !== 'forgotPassword') { return null; }
    const { error } = this.state;

    return (
      <div className={`container`}>
        <h1>{this.props.title}</h1>
        <div className={`form-group`}>
          <label className={`form-check-label`}>Username</label>
          <input className={`form-control`} type="text" placeholder="Username" defaultValue={authData || ''} onChange={event => this.inputs.username = event.target.value} autoFocus />
        </div>
        <div className={`form-row`}>
          <div className={`col`}>
            <button className={`btn btn-primary`} onClick={() => this.changeState('signIn')}>
              Back to sign in
            </button>
          </div>
        </div>
        <button className={`btn btn-primary`} onClick={this.sendCode}>
          Send password reset code
        </button>
        { error && <div className={`alert alert-danger`} role={`alert`}>{error}</div> }
      </div>
    )

  }

}

export default ForgotPassword;
