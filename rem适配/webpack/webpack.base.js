const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PxToRem = require('postcss-pxtorem');
const path = require('path');
const ArgusWebpackPlugin = require('@ies/argus-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';
const buildBoe = process.env.BUILD_TYPE === 'offline';
const isOnline = process.env.BUILD_TYPE === 'online';
const buildClient = process.env.TARGET === 'client';

console.log('>>>>>>>>>>>>buildClient', buildClient);

let cdnPath = 'cdn-tos-sg.byteintl.net/obj/archi-sg'; // => process.env.CDN_INNER_SG from 2023.03.15
if (isOnline && process.env.CDN_OUTER_SG) {
    cdnPath = process.env.CDN_OUTER_SG;
} else if (process.env.CDN_INNER_SG) {
    cdnPath = process.env.CDN_INNER_SG;
}

const ES6Packages = [
    '@byted/serial-components',
    '@arco-design/web-react',
    'bytedesign/web-react',
    '@novel/happy-debug',
];

const baseConfig = {
    output: {
        publicPath: PROD ? `//${cdnPath}/novel-fe/serial-pc-i18n/` : '/',
        assetModuleFilename: PROD ? 'assets/[name].[hash:5][ext]' : 'build/assets/[name].[hash:5][ext]',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@containers': path.resolve(__dirname, '../client/containers'),
            '@components': path.resolve(__dirname, '../client/components'),
            '@constants': path.resolve(__dirname, '../client/constants'),
            '@static': path.resolve(__dirname, '../client/static'),
            '@redux': path.resolve(__dirname, '../client/redux'),
            '@utils': path.resolve(__dirname, '../client/utils'),
            '@service': path.resolve(__dirname, '../client/service'),
            '@locales': path.resolve(__dirname, '../client/locales'),
            '@typings': path.resolve(__dirname, '../typings'),
            '@common': path.resolve(__dirname, '../common'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: new RegExp(`node_modules\/(?!(${ES6Packages.join('|')}))`),
                loader: 'babel-loader',
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader', // px to rem
                        ident: 'postcss',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    PxToRem({
                                        rootValue: 50,
                                        propList: ['*'],
                                        exclude: file => {
                                            // .h5.less文件或者h5目录less文件
                                            if (/\.h5|h5\//.test(file)) {
                                                console.log('------------------------');
                                                console.log('apply postcss Px To Rem');
                                                console.log(file);
                                                return false;
                                            }
                                            return true;
                                        },
                                    }),
                                ],
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 100 * 1024,
                    },
                },
            },
            {
                test: /\.woff|woff2|eot|ttf|otf$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 * 1024,
                    },
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: PROD ? '[name].[contenthash:8].css' : 'build/[name].css',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE),
                BUILD_BASE_COMMIT_HASH: JSON.stringify(process.env.BUILD_BASE_COMMIT_HASH),
                BUILD_VERSION: JSON.stringify(process.env.BUILD_VERSION),
                API_ENV: JSON.stringify(process.env.API_ENV),
                BUILD_REPO_BRANCH: JSON.stringify(process.env.BUILD_REPO_BRANCH),
                BUILD_PUB_DATE: JSON.stringify(process.env.BUILD_PUB_DATE),
                BUILD_USER: JSON.stringify(process.env.BUILD_USER),
            },
        }),
        new ArgusWebpackPlugin({
            csp: {
                enable: buildClient,
            },
            enable: !buildBoe && PROD, // BOE 产物不替换
            customFilter: [
                {
                    target: 'bytedance.net',
                    reg: /bytedance\.net/g,
                },
                {
                    target: 'byted.org',
                    reg: /byted\.org/g,
                },
            ],
        }),
    ],
    devtool: 'source-map',
};

module.exports = {
    baseConfig,
    PROD,
    isOnline,
};
