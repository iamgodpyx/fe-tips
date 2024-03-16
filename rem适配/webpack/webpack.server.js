const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const { baseConfig } = require('./webpack.base');

const config = {
    target: 'node',
    entry: {
        server: path.join(__dirname, '../client/pc/server.tsx'),
        server_h5: path.join(__dirname, '../client/h5/server.tsx'),
    },
    output: {
        path: path.join(__dirname, '../output'),
        filename: 'server/[name].js',
        libraryTarget: 'commonjs2',
    },
    // externals: [
    //     nodeExternals({
    //         allowlist: ['@byted/serial-components', '@arco-design/web-react', '@bytedesign/web-react'],
    //     }),
    // ],
};

module.exports = merge(baseConfig, config);
