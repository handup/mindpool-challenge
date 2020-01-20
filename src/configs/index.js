import omit from 'lodash/omit';
import server from './server';

// @NOTE When exposing the client config we need to strip out keys we don't want to expose to the client
export function client() {
    let excluded = [
        'server',
        'cloudflare'
    ];

    return omit(server, excluded);
}

// @NOTE We resolve the client config in webpack so the bundle always receives configs/client.js and not configs/server.js
export default server;
