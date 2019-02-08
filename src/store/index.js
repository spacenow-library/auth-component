import { createStore } from 'redux';

import SpacenowAuth from './reducers';

const store = createStore(SpacenowAuth, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;

export { default as AmplifyBridge } from './AmplifyBridge';
