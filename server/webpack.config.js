const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

require('dotenv').config(); // Load environment variables

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const { version: APP_VERSION, name: APP_NAME } = require('../package.json');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
    devtool: 'source-map',
    context: __dirname,
    entry: './index.ts',
    target: 'node',
    output: {
        path: __dirname,
        filename: 'index.js',
        devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        loaders: [
            { test: /\.(ts)x?$/, loader: 'ts-loader' }
        ]
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    externals: nodeModules,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'APP_VERSION': JSON.stringify(APP_VERSION),
                'APP_NAME': JSON.stringify(APP_NAME),
                'DB_DIALECT': JSON.stringify(process.env.DB_DIALECT),
                'DB_HOST': JSON.stringify(process.env.DB_HOST),
                'DB_PORT': JSON.stringify(process.env.DB_PORT),
                'DB_DATABASE': JSON.stringify(process.env.DB_DATABASE),
                'DB_USER': JSON.stringify(process.env.DB_USER),
                'DB_PASSWORD': JSON.stringify(process.env.DB_PASSWORD),
                'DB_SYNC': JSON.stringify(process.env.DB_SYNC),
                'SPARKPOST_API_KEY': JSON.stringify(process.env.SPARKPOST_API_KEY),
                'SYSTEM_EMAIL_ADDRESS': JSON.stringify(process.env.SYSTEM_EMAIL_ADDRESS)
            }
        })
    ]
}