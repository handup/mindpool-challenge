import React, { Component } from 'react';
import config from '../../configs/index';
import path from 'path';
import getChunks from '../../utilities/getChunks';
// Components
import HTTPServerLink from '../components/http/HTTPServerLink';

const chunks = getChunks();

/**
 * @property {string} displayName Name of the returned component
 * @property {(Component|Function|null)} initialComponent Server-side loaded component to wrap
 * @property {Function} loadComponent Must return a Promise that resolves to the component to wrap
 * @property {string} [chunkName] Optional chunk name to preload
 */
export default ({ displayName, initialComponent, loadComponent, chunkName }) => class extends Component {
    static displayName = displayName;

    state = { Component: initialComponent };
    static loadComponent = loadComponent;

    componentWillMount() {
        if (global.window){
            loadComponent().then(Component => this.setState({ Component }));
        }
    }

    render() {
        const { Component } = this.state;

        if (!(chunkName in chunks)) {
            return Component && <Component {...this.props} />;
        }

        const assets = chunks[chunkName].assets.filter(asset => !asset.includes('.map'));
        const jsAssets = assets.filter(asset => asset.endsWith('.js'));
        const cssAssets = assets.filter(asset => asset.endsWith('.css'));

        // path.join turns https:// into https:/ or https/ in some cases
        const pathifiedStaticUrl = path.join(config.cdn.static);
        const assetHref = (asset) => path.join(config.cdn.static, '/assets', asset).replace(pathifiedStaticUrl, config.cdn.static);

        const link = [
            ...jsAssets.map(asset => ({
                rel: 'preload',
                as: 'script',
                href: assetHref(asset)
            })),
            ...cssAssets.map(asset => ({
                rel: 'stylesheet',
                href: assetHref(asset)
            }))
        ];

        return (
            <div>
                <HTTPServerLink link={link} />
                {Component && <Component {...this.props} />}
            </div>
        );
    }
};
