Gulp4.0_cli

什么是Gulp

用一句Gulp官方的话来说：

    Gulp就是基于流的前端自动化构建工具

gulp4.0分离了cli和核心部分，对环境要求如下：

    node >= 8.11.1
    npm >= 5.6.0
    npx >= 9.7.1

工作原理

核心原理虽然是通过Node的两个重要模块：FileSystem 和Transform Stream 实现对文件和数据流的操作，并且借鉴了Unix的管道（pipe）的思想，使得处理过的对象从上一个流安全的流入下一个流。但是Gulp没有直接使用这两个模块，而是在FileSystem 和Transform Stream的上面包装了一层vinyl，使流的操作更加简单。

核心API

- gulp.task()：
  用于定义一个具体任务的方法
      gulp.task(name[, deps], fn)
- gulp.src()：
  指定源文件的输入路径，pipe有点像是封闭的“流水线”，某个产品经过上一个工序处理后，就转入下一个工序去处理，直到完成。也就是将上一步的输出转化下一步的输入的中间者。
      gulp.src(globs[, options])
- gulp.dest()：
  指定被处理完的文件的输出路径
      gulp.dest(directory, [options])
  
- gulp.watch()
  用于监听文件变化，文件一修改就会执行指定的任务。在例子中，通过监听./scss/*.scss文件，一旦文件发生修改就会执行任务sass。
      gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])
  

为什么使用Gulp

快速自动构建与编译，通过插件实现本地服务自动刷新，接口代理，编译与预编译，文件合并，资源压缩等等功能,

减少人工且重复的操作，专注业务，快速开发，提高效率。



需要解决什么问题

    1. 不同环境下环境变量不同，接口地址不同，引用静态资源地址不同等等，更新发布都需要手动更改
    2. html,css,js更新图片等静态资源后需要手动更新版本号
    3. 多页面应用公共头部与公共js,css等静态资源通过复制粘贴，手动维护
    4. 多人维护同一项目，不同编辑器下less,scss等预编译文件维护困难
    5. 开发环境自动更新，上线发布代码自动打包压缩

目录介绍

    ├── build                        # 正式环境静态资源
    ├── mock                         # 项目mock 模拟数据
    ├── config					   # 基本模板
    ├── readme_doc				    # 说明文件引用目录
    ├── dist                         # 开发环境静态资源
    │   │── common                   # 公共静态资源文件
    │   │── css                      # css文件
    │   │── images                   # 图片文件
    │   │── js                       # js文件
    │   └── others                   # 其他静态资源文件
    ├── src                          # 源代码
    │   ├── pages                    # 所有模板页面
    │   │   ├── include              # 公共模板
    │   │   │   ├── common-css.html  # 公共头部
    │   │   │   ├── common-js.html   # 公共底部
    │   │   ├── example.html         # 案例模板文件
    │   │   └──index.html            # html模板文件
    │   ├── assets                   # 所有静态资源
    │   │   │── common               # 公共静态资源文件
    │   │   │── css                  # css文件
    │   │   │── images               # 图片文件
    │   │   │── js                   # js文件
    │   │   │── less                 # less文件
    │   │   │── scss                 # scss文件
    │   │   └── others               # 其他静态资源文件
    ├── .babelrc                     # babel-loader 配置
    ├── .gitignore                   # git忽略文件配置
    ├── gulpfile.js                  # gulp脚本配置
    ├── example.html                 # 案例模板生成的文件
    ├── index.html                   # html模板生成的文件
    ├── README                       # README
    ├── package-lock.json            # package-lock.json
    └── package.json                 # package.json

使用方法

    npm i 初始化下载依赖包
    npm run dev    运行开发环境
    npm run prv    打包预览环境
    npm run build  打包生产环境
    npm run sprite 生成自定义精灵图
    npm run mock   运行mock服务

示例用法：

- CONFIG：
      /* 
       * @desc: 统一配置环境变量（根据实际项目情况编辑）
       * @param {type}: NODE_ENV 当前环境名称
       * @param {type}: BASE_API 基础请求Api地址
       * @param {type}: HOME_ROOT 当前环境下主页地址
       * @param {type}: STATIC_ROOT 当前环境下静态资源地址
       * @param {type}: COMMON_ROOT 当前环境下公共静态资源地址
       */
      module.exports = {
         dev: {
            PORT: '3000',
            OUT_PUT: './dist',
            NODE_ENV: 'dev',
            BASE_API: 'https://qa',
            HOME_ROOT: '',
            STATIC_ROOT: './dist',
            COMMON_ROOT: './dist/common',
            EXTEND: '{"LOGIN_ROOT": "//auth-test.youzu.com"}',
         prv: {
            OUT_PUT: './build',
            NODE_ENV: 'prv',
            BASE_API: 'https://prv',
            HOME_ROOT: '',
            STATIC_ROOT: 'https://qapic.youzu.com/youzu/web/mulink',
            COMMON_ROOT: 'https://qapic.youzu.com/youzu/web/mulink/common',
            EXTEND: '{"LOGIN_ROOT": "//auth.youzu.com"}',
         },
         prod: {
            OUT_PUT: './build',
            NODE_ENV: 'prod',
            BASE_API: 'https://',
            HOME_ROOT: '',
            STATIC_ROOT: 'https://pic.youzu.com/youzu/web/mulink',
            COMMON_ROOT: 'https://pic.youzu.com/youzu/web/mulink/common',
            EXTEND: '{"LOGIN_ROOT": "//auth.youzu.com"}',
         sprite: {
            PATH_NAME: 'example-sprite',
         },
         mock: {
            PORT: '3001',
         }
       }
- HTML用法：
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport"
              content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="google-site-verification" content="fuedXEyQBPro66nLv8WgmpDAAUvUlvcwoTy7_nOiEp4" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          @@include('include/common-css.html')
          <link rel="stylesheet" href="<!-- @echo STATIC_ROOT -->/css/index.css?v<!-- @echo RELEASE_TAG -->">
      </head>
      
      <body>
          <!-- content -->
          <h1>test123</h1>
          <img src="<!-- @echo STATIC_ROOT -->/images/test.jpg?v<!-- @echo RELEASE_TAG -->" alt="">
          @@include('include/common-js.html')
          <script type="text/javascript" src="<!-- @echo STATIC_ROOT -->/js/index.js?v<!-- @echo RELEASE_TAG -->"></script>
      </body>
      
      </html>
- JS用法：
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
- SCSS用法：
      $tag: '?v/* @echo RELEASE_TAG */';
      h1 {
            font-size: 30px;
            color: pink;
            @include background('../images/example/mail-bg.png' + $tag)
         }
- CSS用法：
      body {
          background: url('../images/example/mail-bg.png?v/* @echo RELEASE_TAG */')
      }
- SPRITE用法：
      /*
      * 通过配置config.js中sprite变量的PATH_NAME参数，在src/assets/images目录下创建PATH_NAME文件夹，
      * 将需要合成为精灵图的图片文件放置到该目录下，执行npm run sprite即可
      */
      // sprite
      async function sprite() {
          const PATH_NAME = config.sprite.PATH_NAME
          return gulp.src(['src/assets/images/' + PATH_NAME + '/*']).pipe(Spritesmith({
              imgName: 'images/' + PATH_NAME + '.png', //输出图片地址
              cssName: 'scss/' + PATH_NAME + '.scss', //输出sass文件地址
              imgPath: '../images/' + PATH_NAME + '.png?' + RELEASE_TAG, //输出sass image url地址
              padding: 2, //间距
              cssFormat: 'scss' //输出格式
          })).pipe(gulp.dest('src/assets'))
      }
  
- MOCK用法：

    /*
    * 通过配置config.js中mock变量的PORT参数设置mock服务端口号，执行npm run mock
    */
    // server
    async function server(done) {
        Connect.server({
            root: './',
            livereload: true, //自动更新
            port: config[env].PORT || '8080', //端口
            middleware: function (connect, opt) {
                return [
                    Proxy('/korea', {
                        target: 'https://qapay.uzgames.com',
                        changeOrigin: true,
                        pathRewrite: {}
                    }),
                    Proxy('/api', {
                        target: 'http://localhost:' + config.mock.PORT,
                        changeOrigin: true,
                        pathRewrite: {
                            '^/api': ''
                        }
                    })
                ]
            }
        })
    }
    



支持功能：

1. 快速自动构建前端前台项目，通过手动修改config配置项目参数，同步环境变量与自定义参数到html,js,css中使用，快速打包、压缩、发布代码
2. 开发模式下支持实时刷新
3. 支持Less，Scss预编译，ES6语法
4. 支持统一配置公共代码与公共资源
5. 支持自动生成自定义精灵图（目前只支持pc端）
6. 支持mock接口数据及接口代理

备注：

1.配置项更新静态资源仓库
