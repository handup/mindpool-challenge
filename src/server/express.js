import React from 'react';
import {match} from 'react-router';
import {
    ReduxAsyncConnect,
    loadOnServer
} from 'redux-connect';
import path from 'path';
import config from '../configs/index';
import {
    renderToStaticMarkup,
    renderToString
} from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import createStore from '../utilities/store';
import logger from './logger';
import expressWinston from 'express-winston';
import routes from '../routes';
import session from './session';
import getPath from 'lodash/get';
import fs from 'fs';
// Components
import { Provider } from 'react-redux';
import Root from '../app/containers/Root';
import NotFoundContainer from '../app/containers/NotFound';
import ErrorContainer from '../app/containers/Error';
import HTTPCache from '../app/components/http/HTTPCache';
import HTTPStatus from '../app/components/http/HTTPStatus';
// States

global.WEBPACK_BUILD = false;

/***
 * Start Server
 */
export function start(_port) {
    const app = express();
    // @TODO Replace this before profiles goes out
    const distPath = path.join(process.cwd(), '/dist');
    const staticPath = path.join(process.cwd(), '/dist/static');
    const port = _port || process.env.PORT || config.server.port || 3000;

    // SVGSprite Source
    const svgSpriteSource = fs.readFileSync(path.join(staticPath, '/svgs/svgs.svg'), 'utf8');

    /**
     * Render coponent to static markup, and ensure `HTTPStatus` is rewound
     * so it doesn't accidentally leak a status.
     * @param {object} component
     * @param {function} [renderMethod]
     */
    function render(component, renderMethod = renderToStaticMarkup) {
        const html = `<!doctype html>\n${renderMethod(component)}`.replace(/\n\s*/g, '');
        const status = HTTPStatus.rewind();
        return { html, status };
    }

    // Error responses
    const errorResponses = {
        'fallback': {
            html: 'Internal server error',
            json: {
                error: 'Internal server error',
                statusCode: 500
            }
        },
        '404': {
            ...render(
                <Root
                    keepStatic={true}
                    component={<NotFoundContainer />}
                    svgSpriteSource={svgSpriteSource} />
            ),
            json: {
                error: 'Page not found',
                statusCode: 404
            }
        },
        '500': {
            ...render(
                <Root
                    keepStatic={true}
                    component={<ErrorContainer />}
                    svgSpriteSource={svgSpriteSource} />
            ),
            json: {
                error: 'Internal server error',
                statusCode: 500
            }
        }
    };

    /**
     * @name  early404
     * @param req
     * @param res
     */
    const early404 = (req, res) => {
        res.status(404)
            .send(errorResponses['404'].html)
            .end();
    };

    /**
     * @name generateResponse
     * @param status
     * @param request
     * @param response
     * @param htmlBody
     */
    const generateResponse = (status=500, request, response, htmlBody=null) => {
        if (!request || !response) {
            return logger.error(`Request or response is missing for 'generateResponse'`);
        }

        response.status(status);

        let errorResponse = errorResponses[status] || errorResponses['fallback'];

        if (request.accepts('html')) {
            return response.send(htmlBody || errorResponse['html']);
        }

        if (request.accepts('json')) {
            return response.send(errorResponse['json']);
        }

        return response.send(errorResponse['json'].error);
    };

    app.get('/health-check', (_, response) => response.send('ok'));

    // Compress
    app.use(compression());
    // favicon
    app.use(favicon(path.join(distPath, '/favicon.ico')));
    // Static dir
    app.use('/static', express.static(staticPath));
    // if development, serve public
    if (config.env === 'develop') {
        app.use('/', express.static(distPath));
    }
    // early 404 to s3
    app.get('/sitemap-index.xml', early404);
    app.get('/sitemaps*', early404);

    app.post('/authorize', (request, response) => {
        return response
            .status(401)
            .send('E-mail or password incorrect.');
    });

    // Trust first proxy
    app.set('trust proxy', 2);
    // Session
    app.use(session());

    if (config.env === 'develop') {
        app.use(expressWinston.logger({
            winstonInstance: logger,
            expressFormat: true,
            colorize: true,
            statusLevels: true,
            meta: false
        }));
    }

    // Development middlewear
    // @TODO Handle excludeList in config and port
    if (config.env === 'develop') {
        app.use(require('connect-livereload')());
        app.use(require('express-status-monitor')());
    }

    // Request handler
    app.use((request, response, next) => {
        // Create store
        // @TODO Create state nested state for cacheKey
        const store = createStore();

        // Router matching
        match({
            routes,
            location: request.url
        }, (error, redirectLocation, renderProps) => {
            if (error) {
                return next(error);
            }

            // Redirects
            if (redirectLocation) {
                const statusCode = getPath(redirectLocation, 'state.status', 302);
                return response.redirect(statusCode, redirectLocation.pathname + redirectLocation.search);
            }

            // Render root/container
            if (renderProps) {
                // Load container async data
                return loadOnServer({ ...renderProps, store })
                    .then(() => {
                        // Container to render
                        const container = (
                            <Provider store={store}>
                                <ReduxAsyncConnect {...renderProps} />
                            </Provider>
                        );

                        const root = (
                            <Root
                                component={container}
                                store={store}
                                svgSpriteSource={svgSpriteSource} />
                        );

                        const { html, status } = render(root, renderToString);

                        const cacheHeaders = HTTPCache.rewind();
                        response.set(cacheHeaders);

                        // Respond
                        return generateResponse(status, request, response, html);
                    })
                    .catch(next);
            }

            // All else fails 404
            return generateResponse(404, request, response);
        });
    });

    app.use(expressWinston.errorLogger({
        winstonInstance: logger
    }));

    app.use((error, request, response, next) => {
        if (response.headersSent) {
            return next(error);
        }
        return generateResponse(500, request, response);
    });

    // Go server!! ----> o
    app.listen(port, () => {
        logger.info(`Server: Started on port ${port}`);
    });

    return app;
}

export default {
    start
};