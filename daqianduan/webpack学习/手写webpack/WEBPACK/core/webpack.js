const Compiler = require('./compiler')

function webpack(options) {
    const mergeOptions = _mergeOptions(options);

    const compiler = new Compiler(mergeOptions)

    _loadPlugin(options.plugins, compiler);
    return compiler
}

function _mergeOptions(options) {
    const shellOptions = process.argv.slice(2).reduce((option, argv) => {
        const [key, value] = argv.split('=');
        if (key && value) {
            const parseKsy = key.slice(2);
            options[parseKey] = value;
        }
        return option;
    }, {});
    return { ...options, ...shellOptions };
}

function _loadPlugin(plugins, compiler) {
    if (plugins && Array.isArray(plugins)) {
        plugins.forEach((plugin) => {
            plugin.apply(compiler)
        })
    }
}

module.exports = webpack;