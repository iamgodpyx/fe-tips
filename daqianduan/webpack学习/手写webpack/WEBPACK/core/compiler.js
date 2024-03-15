const { SyncHook } = require('tapable');
const { entry } = require('../example/webpack.config');
const { toUnixPath } = require('./utils')

class Compiler {
    constructor(options) {
        this.options = options;
        this.rootPath = this.options.context || toUnixPath(process.cwd())
        this.hooks = {
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook(),
        }
    }

    run(callback) {
        this.hooks.run.call();
        const entry = this.getEntry();
    }

    getEntry() {
        let entry = Object.create(null);
        const { entry: optionsEntry } = this.options
        if (typeof optionsEntry === 'string') {
            entry['main'] = optionsEntry;
        } else {
            entry = optionsEntry
        }
        Object.keys(entry).forEach((key) => {
            const value = entry[key];
            if (!Path.isAbsolute(value)) {
                entry[key] = toUnixPath(path.join(this.rootPath, value))
            } 
        })
        return entry;
    }
    
}

module.exports = Compiler;

module.exports = Compiler