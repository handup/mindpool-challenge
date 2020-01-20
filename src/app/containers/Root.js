import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    renderToStaticMarkup,
    renderToString
} from 'react-dom/server';
import {dehydrate} from '../../utilities/store';
import config from '../../configs/index';
import isEmpty from 'lodash/isEmpty';
import path from 'path';
import getChunks from '../../utilities/getChunks';
// Components
import Helmet from 'react-helmet';
import HTTPServerLink from '../components/http/HTTPServerLink';

const chunks = getChunks();

const fontsStyle = `
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-Light.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-Thin.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-Thin.woff') format('woff');
        font-weight: 100;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-MediumItalic.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-MediumItalic.woff') format('woff');
        font-weight: 500;
        font-style: italic;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-ExtraBold.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-ExtraBold.woff') format('woff');
        font-weight: 800;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-SemiBold.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-SemiBold.woff') format('woff');
        font-weight: 600;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton Book';
        src: url('${config.cdn.static}fonts/campton/Campton-Book.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-Book.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-Medium.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-Medium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton Book';
        src: url('${config.cdn.static}fonts/campton/Campton-BookItalic.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-BookItalic.woff') format('woff');
        font-weight: normal;
        font-style: italic;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}fonts/campton/Campton-LightItalic.woff2') format('woff2'),
            url('${config.cdn.static}fonts/campton/Campton-LightItalic.woff') format('woff');
        font-weight: 300;
        font-style: italic;
    }
    
    @font-face {
        font-family: 'Campton';
        src: url('${config.cdn.static}Campton-Black.woff2') format('woff2'),
            url('${config.cdn.static}Campton-Black.woff') format('woff');
        font-weight: 900;
        font-style: normal;
    }
    
    @font-face {
        font-family: 'Campton Book';
        src: url('${config.cdn.static}Campton-Bold.woff2') format('woff2'),
            url('${config.cdn.static}Campton-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
    }
`;

const lazyLoadStylesheetScript = `
    window.addEventListener('load', function() {
        var style = document.createElement('style');
        style.innerHTML = "${fontsStyle}";
        document.head.appendChild(style);
    });
`.replace(/\n\s*/g, '');

const appAssets = chunks['app'].assets.filter(asset => !asset.includes('.map'));
const jsAssets = appAssets.filter(asset => asset.endsWith('.js'));
const cssAssets = appAssets.filter(asset => asset.endsWith('.css'));
const pathifiedStaticUrl = path.join(config.cdn.static);
const assetHref = (asset) => path.join(config.cdn.static, '/assets', asset).replace(pathifiedStaticUrl, config.cdn.static);

export default class RootContainer extends PureComponent {
    static propTypes = {
        component: PropTypes.node.isRequired,
        store: PropTypes.object,
        keepStatic: PropTypes.bool,

        svgSpriteSource: PropTypes.string
    };

    static defaultProps = {
        keepStatic: false
    };

    render() {
        const {
            component,
            store,
            keepStatic,
            svgSpriteSource
        } = this.props;

        // Render to string needs to be called before Helmet.rewind()
        const renderMethod = keepStatic ? renderToStaticMarkup : renderToString;
        const container = renderMethod(component);
        const helmet = Helmet.rewind();
        const linksRewinded = HTTPServerLink.rewind() || [];

        const links = linksRewinded
            .sort(({href}) => href.endsWith('.css') ? -1 : 1) // put all css files first
            .map(({href, as, type, rel}) => (
                <link
                    key={`${href}${as}${rel}${type}`}
                    href={href}
                    as={as}
                    type={type}
                    rel={rel} />
            ));
        const scriptChunks = linksRewinded.filter(({href}) => href.endsWith('.js'));

        return (
            <html
                dir="ltr"
                lang="en"
                prefix="og:http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
                <head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0" />
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=UA-146539562-1" />
                    <script dangerouslySetInnerHTML={{__html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-146539562-1');
                    `}} />

                    <link
                        href="https://fonts.gstatic.com"
                        rel="preconnect"
                        crossOrigin />
                    <link
                        href={config.cdn.static}
                        rel="preconnect"
                        crossOrigin />
                    <link
                        href={config.api.backend}
                        rel="preconnect"
                        crossOrigin />
                    <link
                        href="https://www.google-analytics.com"
                        rel="preconnect"
                        crossOrigin />
                    <link
                        href="https://www.googletagmanager.com"
                        rel="preconnect"
                        crossOrigin />

                    {cssAssets.map(asset => (
                        <link
                            key={`${assetHref(asset)}.preload`}
                            rel="preload"
                            href={assetHref(asset)}
                            as="style"/>
                    ))}
                    {cssAssets.map(asset => (
                        <link
                            key={assetHref(asset)}
                            rel="stylesheet"
                            href={assetHref(asset)} />
                    ))}

                    {helmet.meta.toComponent()}
                    {helmet.link.toComponent()}
                    {helmet.title.toComponent()}

                    {links}

                    {keepStatic || scriptChunks.map(({href}) => (
                        <script
                            defer
                            src={href}
                            key={href}/>
                    ))}
                    {keepStatic || jsAssets.map(asset => (
                        <script
                            key={assetHref(asset)}
                            defer
                            src={assetHref(asset)} />
                    ))}

                    <script dangerouslySetInnerHTML={{ __html: lazyLoadStylesheetScript }} />

                    <link
                        rel="apple-touch-icon"
                        sizes="57x57"
                        href={`${config.cdn.img}/icons/apple-icon-57x57.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="60x60"
                        href={`${config.cdn.img}/icons/apple-icon-60x60.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="72x72"
                        href={`${config.cdn.img}/icons/apple-icon-72x72.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="76x76"
                        href={`${config.cdn.img}/icons/apple-icon-76x76.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="114x114"
                        href={`${config.cdn.img}/icons/apple-icon-114x114.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="120x120"
                        href={`${config.cdn.img}/icons/apple-icon-120x120.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="144x144"
                        href={`${config.cdn.img}/icons/apple-icon-144x144.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="152x152"
                        href={`${config.cdn.img}/icons/apple-icon-152x152.png`} />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href={`${config.cdn.img}/icons/apple-icon-180x180.png`} />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="192x192"  href={`${config.cdn.img}/icons/android-icon-192x192.png`} />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href={`${config.cdn.img}/icons/favicon-32x32.png`} />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="96x96"
                        href={`${config.cdn.img}/icons/favicon-96x96.png`} />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href={`${config.cdn.img}/icons/favicon-16x16.png`} />
                    <link
                        rel="manifest"
                        href={`${config.cdn.img}/icons/manifest.json`} />
                    <meta name="msapplication-TileColor" content="#ffffff" />
                    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
                    <meta name="theme-color" content="#ffffff" />
                </head>
                <body>
                    <div
                        id="js-root"
                        dangerouslySetInnerHTML={{__html: container}}>
                    </div>

                    <div
                        id="svg-sprite-source"
                        style={{display: 'none'}}
                        dangerouslySetInnerHTML={{__html: svgSpriteSource}}>
                    </div>

                    {!isEmpty(store) && (<script dangerouslySetInnerHTML={{__html: `window.__STATE__=${dehydrate(store)};`}}></script>)}
                    <div id="facebookCustomerChat" />
                </body>
            </html>
        );
    }
}
