import {asyncConnect} from 'redux-connect';
// Components
import asyncComponent from '../../hoc/asyncComponent';


/* global WEBPACK_BUILD */

const AsyncHome = asyncComponent({
    displayName: 'AsyncHome',
    initialComponent: WEBPACK_BUILD ? null : require(`./HomeContainer`).default,
    loadComponent: () => new Promise(resolve => {
        require.ensure(['./HomeContainer'], require => {
            resolve(require('./HomeContainer').default);
        }, 'HomeContainer');
    }),
    chunkName: 'HomeContainer'
});

const serverRenderActions = [{
    promise: () => {
        const promises = [];

        if (global.window) {
            promises.push(AsyncHome.loadComponent());
        }

        return Promise.all(promises);
    }
}];

export default asyncConnect(serverRenderActions)(AsyncHome);
