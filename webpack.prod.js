const merge = require('webpack-merge');
const common = require('./webpack.common');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const config = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
  optimization: { // webpack 최적화를 담당
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimize: true, // terser의 기본동작만 사용
    minimizer: [new TerserWebpackPlugin({
      cache: true // caching된 파일 사용해서 build 시간 단축
    })]
  },
  mode: 'production'
}

module.exports = merge(common, config);