# 프로젝트 설명

webpack을 활용한 bundling 연습

**Webpack?**
  
  1. webpack : 의존 관계에 있는 모듈들을 하나의 자바스크립트 파일로 번들링하는 모듈 번들러이다.
  1. bundle의 이점
    + 모든 모듈을 로드하기 위해 검색하는 시간을 단축
    + 사용하지 않는 코드를 제거
    + 파일의 크기를 축소

## STEP1

1. webpack, webpack-cli 설치
webpack: 핵심 패키지
webpack-cli: 터미널에서 webpack 커맨드를 실행할 수 있게 해주는 커맨드라인 도구

```yarn
yarn add webpack webpack-cli ---dev
```

1. webpack.config.js 생성: entry / output 설정

entry: 시작점. 모듈의 참조관계를 통해 의존성그래프를 만들기 위해 entry를 지정해준다.
output: bundle된 파일

```javascript
const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

1. webpack.config Loader 설정

Loader의 예시로 style-loader,css-loader 사용하여 css 파일 bundle!
(webpack은 기본적으로 js파일만을 bundle! 다른파일들은 loader가 필요하다!)

```yarn
yarn add style-loader css-loader --dev
```

webpack.config.js 파일에 추가

```javascript
module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {injectType: 'singletonStyleTag'}
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
```

index.js에서 style.css import: bundle.js를 통해 css 적용

```javascript
import '../css/style.css';
```

1. webpack.config plugin 설정

html-webpack-plugin을 사용: bundle된 파일이 들어간 html생성해준다.

```yarn
yarn add html-webpack-plugin --dev
```

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

...

plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
```

yarn build를 실행하면 dist 폴더 내에 index.html 파일이 생성된다!

1. clear-webpack-plugin & bundle.[hash].js

새로 bundling된 경우, bundle파일이 변경되었음을 알 수 있도록 파일명에 hash값 추가.
clear-webpack-plugin: 기존의 bundle파일은 삭제(최신 bundle파일만 남는다)

```yarn
yarn add clear-webpack-plugin --dev
```

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

...

plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin() // 최신 bundle파일만 남도록!!
  ]
```
