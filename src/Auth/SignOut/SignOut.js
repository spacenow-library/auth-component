/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import './SignOut.css';

import { Auth, Logger } from 'aws-amplify';
const logger = new Logger('Sign Out');


class SignOut extends React.Component {

  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    Auth.signOut()
      .then(() => logger.info('sign out success'))
      .catch(err => logger.info('sign out error', err));
  }

  render() {
    return (
      <button className={`btn btn-secondary`} onClick={this.signOut}>
        Sign Out
      </button>
    )
  }

}

export default SignOut;
