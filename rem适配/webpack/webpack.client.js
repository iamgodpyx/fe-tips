const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin');
const { baseConfig, PROD, isOnline } = require('./webpack.base');
const { FilterXssPlugin } = require('@ies/filter-xss-webpack-plugin');
const CoverageUploadPlugin = require('@ecom/coverage-upload-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const clientOnly = Boolean(process.env.CLIENT_ONLY);
const clientType = process.env.CLIENT_TYPE || 'pc';
const DEV = process.env.NODE_ENV !== 'production';

const getEntry = (type = 'pc') => {
    if (clientOnly) {
        return {
            index: ['@babel/polyfill', path.join(__dirname, `../client/${type}/index.tsx`)],
        };
    }
    return {
        index: ['@babel/polyfill', path.join(__dirname, '../client/pc/index.tsx')],
        index_h5: ['@babel/polyfill', path.join(__dirname, '../client/h5/index.tsx')],
    };
};

const getHTMLPlugin = () => {
    if (clientOnly) {
        return [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, `../client/template/client_${clientType}.html`),
                chunks: ['index'],
                inject: 'body',
            }),
        ];
    }
    return [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../client/template/pc.ejs'),
            chunks: ['index'],
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            filename: 'index_h5.html',
            template: path.join(__dirname, '../client/template/h5.ejs'),
            chunks: ['index_h5'],
            inject: 'body',
        }),
    ];
};

const webpackPlugin = [
    ...getHTMLPlugin(process.env.CLIENT_TYPE),
    // new LoadablePlugin(),
    ...(!DEV
        ? [
              new FilterXssPlugin({
                  appId: '4793',
                  bid: 'novel_pc_i18n',
                  region: 'sg',
                  reportOnly: false,
                  log: true,
              }),
          ]
        : []),
    // new BundleAnalyzerPlugin()
];

if (!isOnline) {
    webpackPlugin.push(
        new CoverageUploadPlugin({
            gitRepo: 'novel-fe/serial-pc-i18n',
            isDiffSend: true,
            interval: 2000,
            diffSendFileNum: 50,
            retryLimit: 5,
        }),
    );
}

const config = {
    target: ['web', 'es5'],
    entry: getEntry(clientType),
    output: PROD
        ? {
              path: path.join(__dirname, '../output/build'),
              filename: '[name].[contenthash:8].js',
          }
        : {
              path: path.join(__dirname, '../output'),
              filename: 'build/[name].js',
          },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                include: [/node_modules\/@douyin-web/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-modules-commonjs']],
                    },
                },
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                include: [/node_modules\/copy-text-to-clipboard/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        proxy: [
            {
                context: ['/api', '/passport/', '/privacy/', '/ttwid/', '/reading/'],
                target: process.env.API_ENV === 'BOE' ? 'https://fictum-boei18n.byteintl.net/' : 'https://fizzo.org/',
                changeOrigin: true,
                withCredentials: true,
            },
        ],
    },
    plugins: webpackPlugin,
    // optimization: {
    //     minimize: true,
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             debugger: {
    //                 name: 'debugger',
    //                 test: /@byted\/serial-utils\/dist\/tools\/SerialDebugger/,
    //                 priority: 10,
    //             },
    //         },
    //     },
    // },
};

module.exports = merge(baseConfig, config);
