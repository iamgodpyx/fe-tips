const path = require('path')

// 引入loader和plugin
module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, './src/entry1.js'),
        second: path.resolve(__dirname, './src/entry2.js')
    },
    devtool: false,
    context: process.cwd(),
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
    },
    plugins: [new PluginA(), new PluginB()],
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: [
                    path.resolve(__dirname, '../loaders/loader-1.js'),
                    path.resolve(__dirname, '../loader/loader-2.js'),
                ]
            }
        ]
    }
}