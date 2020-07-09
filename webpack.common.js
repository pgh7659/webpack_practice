const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const isProduction = process.env.WEBPACK_ENV === 'production';

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
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name() {
                if(!isProduction) {
                  return '[path][name].[ext]'
                }
                return '[contenthash].[ext]';
              },
              publicPath: isProduction ? 'images/' : '', // 파일의 path에 images를 붙여준다.
              outputPath: isProduction ? 'images/' : '' // dist 폴더에 images 디렉토리 내에 위치
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
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
      minify: isProduction ? 
        {
          collapseWhitespace: true,
          useShortDoctype: true,
          removeScriptTypeAttributes: true
        } 
      : false
    }),
    new CleanWebpackPlugin(), // 최신 bundle파일만 남도록!!
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }), // css 파일에도 hash값 적용
    new webpack.DefinePlugin({
      IS_PRODUCTION: isProduction
    })
  ],
}