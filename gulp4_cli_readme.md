### 使用方法
```
npm i 初始化下载依赖包
npm run dev   运行开发环境
npm run prv   打包预览环境
npm run build 打包生产环境
npm run sprite 打包生成自定义精灵图
```

### 目录文件介绍

1. config: 通过编辑项目相关参数，配置不同环境下的变量，输出到html,js,css等模板中统一使用
2. src: 源代码入口
3. src/assets: 源代码静态资源（common、css、images、js、less、scss、others）
4. src/pages: 源代码子页面
5. src/pages/include: 源代码公共模板页面，用于引用头部底部公共TDK、js、css
6. .babelrc: babel配置文件，目前支持ES6语法及各种新增API
7. .gitignore: git提交文件时忽略目录文件
8. gulpfile.js: gulp构建脚本文件

### 示例用法
```
参考example.html, example.js, example.css, images/example-sprite
```

- HTML用法：

  ```
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
      @@include('include/common-css.html')
  </head>
  
  <body>
      <!-- content -->
      <img src="<!-- @echo STATIC_ROOT -->/images/test.png?v<!-- @echo RELEASE_TAG -->" alt="">
      @@include('include/common-js.html')
  </body>
  
  </html>
  ```

- JS用法：

  ```js
  // 假设当前执行指令 npm run dev
  /* 获取config变量方式1 */
  console.log('/* @echo NODE_ENV */')
  // expect console.log('dev')
  var loginUrl = JSON.parse('/* @echo EXTEND */').LOGIN_ROOT;
  // expect var loginUrl = '//auth-test.youzu.com'
  
  /* 获取config变量方式2 */
  // @if NODE_ENV = 'dev'
  this.Env = 'qa'
  // @endif
  // @if NODE_ENV = 'prv'
  this.Env = 'prv'
  // @endif
  // @if NODE_ENV = 'prod'
  this.Env = ''
  // @endif
  // expect  this.Env = 'qa'
  ```

- SCSS用法：

  ```scss
  $tag: '?v/* @echo RELEASE_TAG */';
  h1 {
        font-size: 30px;
        color: pink;
        @include background('../images/example/mail-bg.png' + $tag)
     }
  ```

- CSS用法

  ```css
  body {
      background: url('../images/example/mail-bg.png?v/* @echo RELEASE_TAG */')
  }
  ```

### 支持功能

1. 快速自动构建前端前台项目，通过手动修改config配置项目参数，同步环境变量与自定义参数到html,js,css中使用，快速打包、压缩、发布代码
2. 开发模式下支持实时刷新
3. 支持ES6语法
4. 支持统一配置公共代码与公共资源
5. 支持自动生成自定义精灵图（目前只支持pc端）