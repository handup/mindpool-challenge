import expect from 'unexpected';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import HTTPStatus from './HTTPStatus';

describe(`HTTPStatus`, () => {
    it('has a displayName', function () {
        var el = <HTTPStatus />;
        expect(el.type.displayName, `to be`, `HTTPStatus`);
    });

    it(`default status code is 200 OK`, () => {
        ReactDOMServer.renderToString(<HTTPStatus code={200} />);
        const code = HTTPStatus.rewind();

        expect(code, `to be`, 200);
    });

    it(`hides itself from the DOM`, () => {
        const html = ReactDOMServer.renderToStaticMarkup(
            <HTTPStatus code={200}>
                <div>Hello, world!</div>
            </HTTPStatus>
        );

        expect(html, `to be`, `<div>Hello, world!</div>`);
    });

    it(`allows only one child`, () => {
        expect(() => {
            ReactDOMServer.renderToStaticMarkup(
                <HTTPStatus code={200}>
                    <div>1</div>
                    <div>2</div>
                </HTTPStatus>
            );
        }, `to throw`, /expected to receive a single (.+) child/);
    });

    describe('.rewind', () => {
        const finalCode = 203;

        const nested = (
            <HTTPStatus code={201}>
                <HTTPStatus code={202}>
                    <HTTPStatus code={finalCode} />
                </HTTPStatus>
            </HTTPStatus>
        );

        const sideBySide = (
            <div>
                <HTTPStatus code={201} />
                <HTTPStatus code={202} />
                <HTTPStatus code={finalCode} />
            </div>
        );

        it(`clears the mounted instances`, function () {
            ReactDOMServer.renderToStaticMarkup(nested);

            expect(HTTPStatus.peek(), `to be`, finalCode);
            HTTPStatus.rewind();
            expect(HTTPStatus.peek(), `to be`, 200);
        });

        it(`returns the latest status code, nested`, function () {
            ReactDOMServer.renderToStaticMarkup(nested);

            expect(HTTPStatus.rewind(), `to be`, finalCode);
        });

        it(`returns the latest status code, side by side`, function () {
            ReactDOMServer.renderToStaticMarkup(sideBySide);

            expect(HTTPStatus.rewind(), `to be`, finalCode);
        });

        it(`returns 200 if no instance was ever mounted`, function () {
            ReactDOMServer.renderToStaticMarkup(<div />);

            expect(HTTPStatus.rewind(), `to be`, 200);
            expect(HTTPStatus.peek(), `to be`, 200);
        });
    });
});
