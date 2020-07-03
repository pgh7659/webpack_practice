const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.[hash].js', // bundle파일이 변경되었음을 알수있도록 bundle.hash값.js
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
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'utf-8'
      }
    }),
    new CleanWebpackPlugin(), // 최신 bundle파일만 남도록!!
    new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}), // css 파일에도 hash값 적용
  ]
}