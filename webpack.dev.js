const merge = require('webpack-merge');
const common = require('./webpack.common');

const config = {
  mode: 'development',
  devServer: {
    open: true, // 실행 시, 기본 브라우저로 연다.
    overlay: true, // 오류 발생 시, 화면에 출력.
    historyApiFallback: {
      rewrites: [
        { from: /^\/subpage$/, to: './src/pages/subpage.html' }, // 특정 url에 대해 html 지정
        { from: /./, to: './src/pages/404.html' }
      ]
    },
    port: 9090 // 포트 설정
  }
}

module.exports = merge(common, config);