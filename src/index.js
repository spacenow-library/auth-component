import React from 'react';
import ReactDOM from 'react-dom';

import Authentication from './Authentication';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Authentication />, document.getElementById('root'));

serviceWorker.unregister();