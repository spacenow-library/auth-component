import React from 'react';
import { Auth, Logger, JS } from 'aws-amplify';
import './ConfirmSignIn.css';

const logger = new Logger('Confirm Sign In');

class ConfirmSignIn extends React.Component {
  
  constructor(props) {
    super(props);
    this.confirmSignIn = this.confirmSignIn.bind(this);
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

  confirmSignIn() {
    const user = this.props.authData;
    const { code } = this.inputs;
    logger.info('confirm sign in with ' + code);
    const mfaType = user.challengeName === 'SOFTWARE_TOKEN_MFA'
      ? 'SOFTWARE_TOKEN_MFA'
      : null;
    Auth.confirmSignIn(user, code, mfaType)
      .then(() => this.confirmSuccess(user))
      .catch(err => this.confirmError(err));
  }

  confirmSuccess(user) {
    logger.info('confirm sign in success', user);
    this.setState({ error: '' });

    this.checkContact(user);
  }

  confirmError(err) {
    logger.info('confirm sign in error', err);
    this.setState({ error: err.message || err });
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        logger.info('verified contacts', data);
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      })
      .catch(err => {
        logger.info('check verified contact error', err);
      });
  }

  render() {

    const { authState } = this.props;
    if (authState !== 'confirmSignIn') { return null; }
    const { message, error } = this.state;

    return (
        <div className={`container`}>
          <h1>{this.props.title}</h1>
            <div className={`form-group`}>
              <label className={`form-check-label`}>Code</label>
              <input className={`form-control`} type="text" placeholder="Code" onChange={event => this.inputs.code = event.target.value} autoFocus />
            </div>

            <div className="form-row">
              <div className="col">
                <button className={`btn btn-primary`} onClick={() => this.changeState('signIn')}>
                  Back to sign in
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="col">
                <button className={`btn btn-primary`} onClick={this.confirmSignIn}>
                  Confirm
                </button>
              </div>
            </div>
            { message && <div className={`alert alert-success`} role={`alert`}>{message}</div> }
            { error && <div className="alert alert-danger" role="alert">{error}</div> }
        </div>
    );
  }
}

export default ConfirmSignIn;