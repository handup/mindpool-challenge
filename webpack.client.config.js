const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postCSSConfig = require('./postcss.config.js');
//const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const env = require('./src/configs/index').default;
const clientEnv = require('./src/configs/index').client();

const paths = {
    src: path.join(process.cwd(), '/src'),
    dist: path.join(process.cwd(), '/dist/')
};

const isDevelop = env.env === 'develop';
const isStaging = env.env === 'staging';
const isProduction = env.env === 'production';

const postCSSLocalIdentName = isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:7]';
const fileName = extension => isProduction ? `[contenthash:8].${extension}` : `[name].${extension}`;

const publicPath = `${env.cdn.static}assets/`;

const plugins = [
    new webpack.NormalModuleReplacementPlugin(
        /configs\/index$/,
        require.resolve('./src/configs/client.js')
    ),
    new webpack.DefinePlugin({
        __ENV__: JSON.stringify(clientEnv),
        WEBPACK_BUILD: true,
        ...(isStaging || isProduction ? {
            'process.envExtendedEnv': {
                NODE_ENV: JSON.stringify('production')
            }
        } : {})
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        options: {
            postcss: postCSSConfig
        }
    }),
    new MiniCssExtractPlugin({
        filename: fileName('css'),
        chunkFilename: fileName('css')
    })
];

if (isDevelop) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

export default {
    target: 'web',
    mode: isDevelop ? 'development' : 'production',
    ...(isDevelop ? {
        watch: true,
        devtool: 'eval'
    } : {}),
    ...(isStaging || isProduction ? {
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true
                }),
                new OptimizeCSSAssetsPlugin()
            ]
        }
    } : {}),
    entry: {
        app: path.join(paths.src, '/client.js')
    },
    output: {
        path: path.join(paths.dist, '/static/assets/'),
        publicPath,
        filename: fileName('js'),
        chunkFilename: fileName('js')
    },
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
                            autoprefixer: false,
                            context: process.cwd(),
                            modules: true,
                            importLoaders: 1,
                            localIdentName: postCSSLocalIdentName
                        }
                    },
                    'postcss-loader'
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
            '.css'
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
