# 프로젝트 설명

webpack을 활용한 bundling 연습

- **STEP1**

1. webpack, webpack-cli 설치

```yarn
yarn add webpack webpack-cli ---dev
```

1. webpack.config.js 생성: entry / output 설정

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
