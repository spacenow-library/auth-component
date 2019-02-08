import { Auth, Hub, Logger } from 'aws-amplify';

import { switchUser } from './actions';

const logger = new Logger('AmplifyBridge');

export default class AmplifyBridge {
  constructor(store) {
    this.store = store;

    this.onHubCapsule = this.onHubCapsule.bind(this);
    Hub.listen('auth', this, 'AmplifyBridge'); // Add this component as a listener of auth events.

    this.checkUser(); // first check
  }

  onHubCapsule(capsule) {
    logger.info('on Auth event', capsule);
    this.checkUser(); // triggered every time user sign in / out
  }

  checkUser() {
    Auth.currentAuthenticatedUser()
      .then(user => this.checkUserSuccess(user))
      .catch(err => this.checkUserError(err));
  }

  loadUserInfo(user) {
    Auth.currentUserInfo()
      .then(info => this.loadUserInfoSuccess(user, info))
      .catch(err => this.loadUserInfoUserError(user, err));
  }

  checkUserSuccess(user) {
    logger.info('check user success', user);
    this.loadUserInfo(user);
  }

  checkUserError(err) {
    logger.info('check user error', err);
    this.store.dispatch(switchUser(null));
  }

  loadUserInfoSuccess(user, info) {
    logger.info('load user info success', user, info);
    Object.assign(user, info);
    this.store.dispatch(switchUser(user));
  }

  loadUserInfoError(user, err) {
    logger.info('load user info error', err);
    this.store.dispatch(switchUser(user)); // Still dispatchs user object
  }

}

