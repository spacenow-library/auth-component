import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'

Auth.configure(awsconfig);

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();