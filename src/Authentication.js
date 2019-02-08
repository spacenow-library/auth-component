import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';
import 'bootstrap/dist/css/bootstrap.css';

import awsconfig from './aws-exports';
import store, { AmplifyBridge } from './store';
import { SignIn, ConfirmSignIn, SignUp, ConfirmSignUp, ForgotPassword, ForgotPasswordReset, SignOut } from './Auth';

Amplify.configure(awsconfig);
new AmplifyBridge(store);

const CustomAuthenticator = (props) => (
  <Authenticator hideDefault>
    <SignIn />
    <ConfirmSignIn />
    <SignUp />
    <ConfirmSignUp />
    <ForgotPassword />
    <ForgotPasswordReset />
  </Authenticator>
)

class App extends Component {

  constructor(props) {
    super(props);
    this.storeListener = this.storeListener.bind(this);
    this.state = { user: null }
  }

  componentDidMount() {
    this.unsubscribeStore = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  storeListener() {
    this.setState({ user: store.getState().user });
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        { !user && <CustomAuthenticator /> }
        { user && <div>You are signed in as <span font="italic">{user.username}</span>.<SignOut /></div> }
      </React.Fragment>
    )
  }
  
}

export default App;
