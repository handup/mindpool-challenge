import React from 'react';
import './polyfill.js';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';
import createStore from './utilities/store';
import createHistory from './client/history';
import routes from './routes';
import 'what-input';
import { browserHistory } from 'react-router';
// Components
import {Provider} from 'react-redux';
// Styles
import './styles/base.css';

const store = createStore(window.__STATE__ || {});
const history = browserHistory  ;
const dest = document.getElementById('js-root');

render(
    <Provider store={store}>
        <Router render={(props) => <ReduxAsyncConnect {...props} />} history={history}>
            {routes}
        </Router>
    </Provider>,
    dest
);
