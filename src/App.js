import React, { Component } from 'react';
import './App.css';


import { Auth } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react';

import { 
  SignIn,
  ConfirmSignIn,
  SignUp,
  ConfirmSignUp,
  ForgotPassword,
  ForgotPasswordReset,
  SignOut
} from './Auth';

const CustomAuthenticator = props => (
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
    super(props)
    this.state = { user: '' }
  }

  componentWillMount() {
    Auth.currentAuthenticatedUser()
        .then( user => {
            this.setState({user: user})
        })
  }

  render() {
    
    const { user } = this.state;
    return (
        !user ? <CustomAuthenticator />
        : <div>You are signed in as { user.username } <SignOut /></div>
    )
  }
  
}

export default App;
