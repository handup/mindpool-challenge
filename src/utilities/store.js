import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import serialize from 'serialize-javascript';
import thunk from 'redux-thunk';
import config from '../configs/index';
import combinedReducers from '../app/state/index';

/**
 Dehydrate
 */
export function dehydrate(store) {
    return serialize(store.getState());
}

/**
 * Create store
 * @param initialState
 * @returns {*}
 */
export default function create(initialState = {}) {
    const enhancer = [
        applyMiddleware(thunk)
    ];

    if (config.env === 'develop' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancer.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }

    const store = createStore(
        combinedReducers,
        initialState,
        compose(...enhancer)
    );

    // Hot reloading reducers is now explicit
    // https://github.com/reactjs/react-redux/releases/tag/v2.0.0
    if (config.env === 'develop' && module.hot) {
        module.hot.accept('../app/state/index', () => {
            const nextCombinedReducers = require('../app/state/index').default;

            store.replaceReducer(nextCombinedReducers);
        });
    }

    return store;
}
