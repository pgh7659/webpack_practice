const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: '[name].[chunkhash].js', // bundle파일이 변경되었음을 알수있도록 name.hash값.js
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {injectType: 'singletonStyleTag'}
          // },
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'WEBPACK | PRACTICE',
      meta: {
        viewport: 'width=device-width, initial-scal,e=1.0',
      },
      minify: {
        collapseWhitespace: true,
        useShortDoctype: true,
        removeScriptTypeAttributes: true
      }
    }),
    new CleanWebpackPlugin(), // 최신 bundle파일만 남도록!!
    new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}), // css 파일에도 hash값 적용
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
  mode: 'none'
}