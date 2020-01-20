import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postCSSConfig from './postcss.config.js';
import nodeExternals from 'webpack-node-externals';
import env from './src/configs/server';
import {client} from './src/configs/index';
//import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

const clientEnv = client();

const paths = {
    src: path.join(process.cwd(), '/src'),
    dist: path.join(process.cwd(), '/dist-server/')
};

const isDevelop = env.env === 'develop';
const isStaging = env.env === 'staging';
const isProduction = env.env === 'production';

const postCSSLocalIdentName = isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:7]';

const plugins = [
    new webpack.NormalModuleReplacementPlugin(
        /configs\/index$/,
        require.resolve('./src/configs/server.js')
    ),
    new webpack.DefinePlugin({
        __ENV__: JSON.stringify(clientEnv),
        WEBPACK_BUILD: false,
        'process.env': {
            ...(Object.entries(process.env).reduce((result, [key, value]) => ({
                ...result,
                [key]: JSON.stringify(value)
            }), {})),
            ...(isStaging || isProduction ? {
                NODE_ENV: JSON.stringify('production')
            } : {})
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: {
            postcss: postCSSConfig
        }
    }),
    new MiniCssExtractPlugin({
        filename: isDevelop ? `[name].css` : `[name].css`,
        chunkFilename: isDevelop ? `[name].css` : '[chunkhash:6].css'
    })
];

export default {
    target: 'node',
    mode: 'production',
    devtool: 'eval',
    entry: {
        server: path.join(paths.src, '/server/express.js')
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: 'server',
        libraryTarget: 'umd',
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                'lodash',
                                'transform-runtime',
                                'transform-decorators-legacy'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            context: process.cwd(),
                            modules: true,
                            importLoaders: 1,
                            localIdentName: postCSSLocalIdentName
                        }
                    },
                    'postcss-loader',
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto'
            }
        ],
        noParse: /\.min\.js/
    },
    stats: {
        all: false,
        chunkGroups: true
    },
    resolve: {
        modules: [
            'node_modules',
            'src'
        ],
        extensions: [
            '.js',
            '.css',
            '.json'
        ],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class',
            'lodash-es': 'lodash'
        }
    },
    plugins
};
