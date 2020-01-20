import expect from 'unexpected';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import HTTPCache from './HTTPCache';

describe('HTTPCache', () => {
    it(`default output is empty map`, () => {
        ReactDOMServer.renderToString(<HTTPCache />);
        const headers = HTTPCache.rewind();

        expect(headers, `to be empty`);
    });

    it(`generates 'Expires' header`, () => {
        const date = `Fri, 04 May 2018 11:32:36 GMT`;
        ReactDOMServer.renderToString(<HTTPCache expires={Date.parse(date)} />);
        const headers = HTTPCache.rewind();

        expect(headers, `to equal`, { 'Expires': date });
    });

    it(`generates 'Cache-Control' header with 'max-age'`, () => {
        ReactDOMServer.renderToString(<HTTPCache maxAge={3600} />);
        const headers = HTTPCache.rewind();

        expect(headers, `to equal`, { 'Cache-Control': `max-age=3600` });
    });

    it(`can be mounted multiple time, combining props`, () => {
        const date = `Fri, 04 May 2018 11:32:36 GMT`;
        ReactDOMServer.renderToString(
            <div>
                <HTTPCache expires={Date.parse(date)} />
                <HTTPCache maxAge={3600} />
            </div>
        );
        const headers = HTTPCache.rewind();

        expect(headers, `to equal`, {
            'Expires': date,
            'Cache-Control': `max-age=3600`
        });
    });

    it(`hides itself from the DOM`, () => {
        const html = ReactDOMServer.renderToStaticMarkup(
            <HTTPCache>
                <div>Hello, world!</div>
            </HTTPCache>
        );

        expect(html, `to be`, `<div>Hello, world!</div>`);
    });

    it(`allows only one child`, () => {
        expect(() => {
            ReactDOMServer.renderToStaticMarkup(
                <HTTPCache>
                    <div>1</div>
                    <div>2</div>
                </HTTPCache>
            );
        }, `to throw`, /expected to receive a single (.+) child/);
    });
});
