const fs = require("fs");
class PrefetchPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("MyPlugin", (compilation) => {
      const { publicPath, path } = compilation.outputOptions;

      const entryList = Array.from(compilation.entrypoints.keys());
      if (!entryList.length) {
        console.log("prefetch error:: no find entry");
        return;
      }
      const files = compilation.entrypoints.get(entryList[0]).getFiles();
      const resourceList = files.map((file) => `${publicPath}${file}`);

      console.log("prefetch resourceList:: ", resourceList);

      const content = `
            var list = [${resourceList.map((i) => `'${i}'`)}];

            function addPrefetchLink(href) {
                var link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = href;
                document.head.appendChild(link);
            }

            for (var i = 0; i < list.length; i++) {
                addPrefetchLink(list[i]);
            }
            `;

      const dist = path.replace(`${__dirname}/`, "");
      const outputDir = `${dist}/html`;
      if (fs.existsSync(outputDir)) {
        fs.writeFileSync(`${outputDir}/prefetch.js`, content);

        console.log("prefetch write script:: ", outputDir);
      }
    });
  }
}

module.exports = PrefetchPlugin;
