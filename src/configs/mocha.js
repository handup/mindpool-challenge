var path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../../deployment/envs/develop.env')
});
require('babel-core/register')({
    plugins: ['babel-plugin-rewire']
});
require('ignore-styles');
