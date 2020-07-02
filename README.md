# 프로젝트 설명

webpack을 활용한 bundling 연습

- **STEP1**

1. webpack, webpack-cli 설치

```yarn
yarn add webpack webpack-cli ---dev
```

1. webpack.config.js 생성

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
