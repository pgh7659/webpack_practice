# Webpack-practice

> webpack을 활용한 bundling 연습

**Webpack?**
  
  1. webpack : 의존 관계에 있는 모듈들을 하나의 자바스크립트 파일로 번들링하는 모듈 번들러이다.
  1. bundle의 이점
      + 모든 모듈을 로드하기 위해 검색하는 시간을 단축
      + 사용하지 않는 코드를 제거
      + 파일의 크기를 축소
  1. 구성
      + entry: 의존성 그래프의 시작점. 엔트리를 통해서 필요한 모듈을 로딩한고 하나의 파일로 묶는다.
      + output: 엔트리를 시작으로 의존되어 있는 모든 모듈을 하나로 묶은 번들된 결과물의 위치 지정.
      + module: 웹팩은 자바스크립트 밖에 모른다. 비 자바스크립트 파일을 웹팩이 이해하게끔 변경하는 역할을 한다.
      + plugin: 번들된 결과물을 처리하는 역할을 한다. Ex. 번들된 자바스크립트를 난독화

## STEP1 기본 설정

### 1. webpack, webpack-cli 설치

webpack: 핵심 패키지
webpack-cli: 터미널에서 webpack 커맨드를 실행할 수 있게 해주는 커맨드라인 도구

```yarn
yarn add webpack webpack-cli ---dev
```

---

### 2. webpack.config.js 생성: entry / output 설정

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

---

### 3. Loader(css) : style-loader, css-loader

Loader의 예시로 style-loader,css-loader 사용하여 css 파일 bundle!  
(webpack은 기본적으로 js파일만을 bundle! 다른파일들은 loader가 필요하다!)

```yarn
yarn add style-loader css-loader --dev
```
  
<br>  

_webpack.config.js_

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

entry의 js파일 상단에서 import 'style.css';를 하면 알아서 읽어서 style 태그로 만들어줍니다  
index.js에서 style.css import => bundle.js를 통해 css 적용
  
<br>  

_index.js_

```javascript
import '../css/style.css';
```

---

### 4. PlugIn(html) : html-webpack-plugin

html-webpack-plugin을 사용: bundle된 파일이 들어간 html생성해준다.

```yarn
yarn add html-webpack-plugin --dev
```
  
<br>  

_webpack.config.js_

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

...

plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'WEBPACK | PRACTICE',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'utf-8'
      }
    }),
    new CleanWebpackPlugin() // 최신 bundle파일만 남도록!!
  ]
```

> title, meta를 이용해 `<title>`, `<meta>`를 추가할 수 있다.

yarn build를 실행하면 dist 폴더 내에 index.html 파일이 생성된다!

---

### 5. Loader(css) : MiniCssExtractPlugin

css파일을 생성하고, 생성되는 html 안에 `<link>`태그로 작성된다.

```yarn
yarn add mini-css-extract-plugin --dev
```

> 절대로 style-loader를 넣어서는 안된다! style-loader는 서버 사이드 렌더링을 지원하지 않는다.
  
<br>  

_webpack.config.js_

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

...

module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {
          //     injectType: 'singletonStyleTag'
          //   }
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
    ...  
    new MiniCssExtractPlugin()
  ]
```

---

## STEP2 효과적 Caching

### 1. 파일명 hash값 설정 && PlugIn : clean-webpack-plugin

![browser-cache img](/src/images/browse_cache.png)
cache의 구분 기준은 url! 로드하는 리소스 이름이 같은 경우에는 이전 결과를 보여준다.
새로 bundling된 경우, bundle파일이 변경되었음을 알 수 있도록 파일명에 hash값 추가.  
  
clean-webpack-plugin: 기존의 bundle파일은 삭제(최신 bundle파일만 남는다)

```yarn
yarn add clean-webpack-plugin --dev
```
  
<br>  

_webpack.config.js_

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  
...
  
output: {
    filename: 'bundle.[hash].js', // bundle파일이 변경되었음을 알수있도록 bundle.hash값.js => bundling시에만!
    path: path.resolve(__dirname, 'dist')
  },

...
  
plugins: [  
  ...  
    new CleanWebpackPlugin(), // 최신 bundle파일만 남도록!!
    new MiniCssExtractPlugin({filename: 'style.[contenthash]].css'}), // css 파일에도 hash값 적용
  ]
```

> [contenthash]를 적용할 경우, 해당 파일의 수정이 일어난 경우에만 hash값 변경
[hash]적용 시, js파일의 수정으로 build 시 css파일의 hash까지 변경된다. cache 사용이 무의미.

---

### 2. chunk

bundling을 통해 하나의 파일로 묶으면서 파일의 크기가 커지는 문제가 발생한다.  
이를 chunk를 통해 bundle파일을 덩어리로 구분하여 나눈다.  
    - runtime chunk
    - vendor chunk

#### 1. runtimeChunk

runtime에서 쓰이는 고정적인 모듈들과 나머지 모듈들을 구분.(runtime.js로 생성)  
  
<br>  

_webpack.config.js_

```javascript
output: {
  filename: '[name].[chunkhash].js', // bundle파일이 변경되었음을 알수있도록 name.hash값.js
  path: path.resolve(__dirname, 'dist')
},  

...  

optimization: { // webpack 최적화를 담당
  runtimeChunk: 'single',
},
```

#### 2. vendorChunk

외부의 모듈들을 따로 vendors로 구분.(vendors.js로 생성)  
  
<br>  

_webpack.config.js_

```javascript
output: {
  filename: '[name].[chunkhash].js', // bundle파일이 변경되었음을 알수있도록 name.hash값.js
  path: path.resolve(__dirname, 'dist')
},  

...  

optimization: { // webpack 최적화를 담당
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
},
```

### 3. Minification &&  Mangling

1. 어플리케이션 실행에 관여하지 않는 소스 제거 ex.주석, console.log  
1. 공백제거 및 분기문 삼항연산으로 변경  
1. 난독화
을 통해 파일의 크기를 최소화 시킨다.  

#### 1. HTML: html-webpack-plugin(minify)

_webpack.config.js_

```javascript
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

    ...
],
```

#### 2. CSS: optimize-css-assets-plugin / cssnano 사용

```yarn
yarn add cssnano optimize-css-assets-plugin --dev
```

_webpack.config.js_

```javascript
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

plugins: [
    ...  

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
```

### 3. Javascript: terser-webpack-plugin

webpack에 기본으로 포함되어있는 terser 모듈을 사용.

```yarn
yarn add terser-webpack-plugin --dev
```

_webpack.config.js_

```javascript
const TerserWebpackPlugin = require('terser-webpack-plugin');  

...  

optimization: { // webpack 최적화를 담당
    ...  

    minimize: true, // terser의 기본동작만 사용
    minimizer: [new TerserWebpackPlugin({
      cache: true // caching된 파일 사용해서 build 시간 단축
    })]
  },
```

---

## STEP3 Mode

+ development: 개발에 필요한 모듈들만 사용하여 build 속도 향상을 목표.  
+ production: 최적화 작업을 진행.

webpack.common.js, webpack.dev.js, webpack.prod.js로 config 파일을 분리하여 관리  
webpack-merge를 사용하여 각각 common과 합쳐서 개발과 사용 설정 파일을 생성한다.

```yarn
yarn add webpack-merge --dev
```

_webpack.common.js_

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  ],
  mode: 'none'
}
```

_webpack.dev.js_

```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common');

const config = {
  mode: 'development'
}

module.exports = merge(common, config);
```

_webpack.prod.js_

```javascript
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
```

#### 실행 스크립트를 통해 전역변수 생성

cross-env library설치
> OS마다 다른 환경 변수 설정을 처리해준다.

```yarn
yarn add cross-env --dev
```

_package.json_

```json
"scripts": {
    "dev": "cross-env WEBPACK_ENV=development webpack --config webpack.dev.js",
    "build": "cross-env WEBPACK_ENV=production webpack --config webpack.prod.js"
  },
```  

이제 WEBPACK_ENV 변수를 통해 development / production을 구분할 수 있다.  
production 모드에서만 HtmlWebpackPlugin의 minify가 동작하도록 수정한다!  

_webpack.common.js_

```javascript
const webpack = require('webpack'); // DefinePlugin 사용하기 위해
const isProduction = process.env.WEBPACK_ENV === 'production';  

...  

plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'WEBPACK | PRACTICE',
      meta: {
        viewport: 'width=device-width, initial-scal,e=1.0',
      },
      minify: isProduction ? {
        collapseWhitespace: true,
        useShortDoctype: true,
        removeScriptTypeAttributes: true
      } : false
    }),  

    ...  

    new webpack.DefinePlugin({
      IS_PRODUCTION: isProduction
    })
  ],
```

> webpack.DefinePlugin : build 시, 전역에서 사용 가능한 변수 생성(runtime 시에는 사용 불가!)  

### webpack-dev-server

1. 로컬에서 사용할 개발용 서버를 제공합니다.
1. 이 기능을 사용하여 소스 파일을 감시하고 내용이 변경될 마다 번들을 다시 컴파일 합니다.
1. 수시로 새로고침을 하지 않아 편리합니다.  

```yarn
yarn add webpack-dev-server --dev
```  

_package.json_  

```json
"scripts": {
    "devstart": "cross-env WEBPACK_ENV=development webpack-dev-server --config webpack.dev.js",  
  },
```

_webpack.dev.js_  

```javascript
const config = {
  ...  

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
```

## STEP4 File-Loader

파일을 입력받아 출력해준다.

## STEP5 URL-Loader

리소스들을 문자열 형태로 변환해준다.
url-loader 이점: 리소스 요청수를 줄일 수 있다.
url-loader의 fallback은 file-loader가 기본값이다!(option-fallback에서 다른 로더로 지정할 수 있다.)

```yarn
yarn add url-loader --dev
```

```javascript
module: {
    rules: [  
      ...  

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192 // 이 이상의 용량은 file-loader로 처리!
            }
          }
        ]
      }
    ]
  },  
  ...
```