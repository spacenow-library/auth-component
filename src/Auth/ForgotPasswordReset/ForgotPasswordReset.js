/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import './ForgotPasswordReset.css';

import { Auth, Logger } from 'aws-amplify';
const logger = new Logger('Forgot Password');


class ForgotPasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
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

  submit() {
    const username = this.props.authData;
    if (!username) {
      this.setState({ error: 'missing username' });
      return;
    }

    const { code, password } = this.inputs;
    logger.info('reset password for ' + username);
    Auth.forgotPasswordSubmit(username, code, password)
      .then(data => this.submitSuccess(username, data))
      .catch(err => this.handleError(err));
  }

  submitSuccess(username, data) {
    logger.info('forgot password reset success for ' + username, data);
    this.changeState('signIn', username);
  }

  handleError(err) {
    logger.info('forgot password reset error', err);
    this.setState({ error: err.message || err });
  }

  render() {

    const { authState } = this.props;
    if (authState !== 'forgotPasswordReset') { return null; }
    const { error } = this.state;

    return (
        <div className={`container`}>
          <h1>{this.props.title}</h1>
          <div className={`form-group`}>
            <label className={`form-check-label`}>Code</label>
            <input className={`form-control`} type="text" placeholder="Code" onChange={event => this.inputs.code = event.target.value} autoFocus />
          </div>
          <div className={`form-group`}>
            <label className={`form-check-label`}>Password</label>
            <input className={`form-control`} type="password" placeholder="Password" onChange={event => this.inputs.password = event.target.value} autoFocus />
          </div>
          <div className={`form-row`}>
            <div className={`col`}>
              <button className={`btn btn-primary`} onClick={() => this.changeState('forgotPassword')}>
                Back to forgot password
              </button>
            </div>
          </div>
          <button className={`btn btn-primary`} onClick={() => this.submit}>
            Reset password
          </button>
          { error && <div className={`alert alert-danger`} role={`alert`}>{error}</div> }
        </div>
    )
  }

}

export default ForgotPasswordReset;
