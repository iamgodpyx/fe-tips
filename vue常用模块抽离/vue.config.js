const UnoCSS = require('@unocss/webpack').default
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  devServer: {
    proxy: {
      '/gt-maw': {
        target: 'http://10.179.46.14:8991',
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: false
    }
  },
  crossorigin: process.env.NODE_ENV !== 'production' ? undefined : 'anonymous',
  productionSourceMap: true,
  chainWebpack: config => {
    config.module.rule('vue').uses.delete('cache-loader')
    config.module.rule('tsx').uses.delete('cache-loader')
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules\/@vueuse\/shared\/index.mjs/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')

    const BizDllReferencePlugin = require('@didi/webpack-biz-dll-reference-plugin')
    // if (process.env.NODE_ENV === 'production') {
    config.plugin('bizDll').use(BizDllReferencePlugin, [
      {
        dllName: 'biz-dll-driver'
      }
    ])
    config.devtool('hidden-source-map')
    // }
  },
  configureWebpack: {
    plugins: [new UnoCSS(), ...(process.env.NODE_ENV !== 'production' ? [new BundleAnalyzerPlugin()] : [])]
  }
}
