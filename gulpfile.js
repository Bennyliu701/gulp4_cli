const ora = require('ora') //加载提示
const gulp = require('gulp') //构建工具
const chalk = require('chalk') //控制台字符串高亮显示
const If = require('gulp-if') //条件执行脚本
const Sourcemaps = require('gulp-sourcemaps') // 映射嵌入到源文件
const Spritesmith = require('gulp.spritesmith') //将一组图像转换为spritesheet和CSS变量
//html
const Preprocess = require('gulp-preprocess') //基于自定义上下文或环境配置预处理HTML、JavaScript和其他文件
const FileInclude = require('gulp-file-include') // 文件模块化
// js
const Concat = require('gulp-concat') //连接合成文件
const Uglify = require('gulp-uglify') //压缩js文件
const Jshint = require("gulp-jshint") //js检查
const babel = require('gulp-babel') //js转译
// less scss css 
const Less = require('gulp-less') //less转译为css
const Sass = require('gulp-sass') //scss转译为css
const autoprefixer = require('gulp-autoprefixer') // css前缀
const SassImport = require('gulp-sass-import') //从目录路径中将默认文件定义为@import,便于引用其他scss文件
const MinifyCss = require('gulp-minify-css') // 压缩css
// image
const Cache = require('gulp-cache') //基于临时文件的缓存代理任务
const Imagemin = require('gulp-imagemin') //压缩 PNG, JPEG, GIF and SVG images 
const Pngquant = require('imagemin-pngquant') //png图片压缩插件
// server
const Connect = require('gulp-connect') //引入gulp-connect模块 
const Proxy = require('http-proxy-middleware') //js代理中间件
const nodemon = require('gulp-nodemon') //与nodemon 的功能差不多一样，用于检测启动文件

const Clean = require('gulp-clean') // 清理目录

const config = require('./config/config')
const env = process.env.NODE_ENV || 'dev'
const OUT_PUT = config[env].OUT_PUT
const BASE_API = config[env].BASE_API
const HOME_ROOT = config[env].HOME_ROOT
const STATIC_ROOT = config[env].STATIC_ROOT
const COMMON_ROOT = config[env].COMMON_ROOT
const EXTEND = config[env].EXTEND
const RELEASE_TAG = new Date().getTime()
const IS_PROD = env == 'prod' ? true : false
const CONTEXT = {
    NODE_ENV: env,
    BASE_API: BASE_API,
    HOME_ROOT: HOME_ROOT,
    STATIC_ROOT: STATIC_ROOT,
    COMMON_ROOT: COMMON_ROOT,
    EXTEND: EXTEND,
    RELEASE_TAG: RELEASE_TAG,
}

const SRC_LIST = {
    html: 'src/pages/*.html',
    common_js: 'src/assets/common/js/*.js',
    common_css: 'src/assets/common/css/*.css',
    js: 'src/assets/js/*.js',
    less: 'src/assets/less/**',
    scss: 'src/assets/scss/**',
    css: 'src/assets/css/*.css',
    images: 'src/assets/images/**',
}

const spinner = ora(
    'building for ' + chalk.green(env) + ' environment...'
)
spinner.start()

// html
async function html() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    return gulp.src([SRC_LIST.html, '!./src/pages/include/**.html'])
        .pipe(FileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(gulp.dest('./'))
        .pipe(Connect.reload())
}

// assets
async function assets() {
    const excludeList = Object.values(SRC_LIST).map(function (ite) {
        if (ite) return '!' + ite
    })
    excludeList.unshift('src/assets/**')
    // 适配assets下所有内容，排除已有任务（最终生成静态资源为了节省空间，不应该包含编译文件）
    return gulp.src(excludeList)
        .pipe(gulp.dest(OUT_PUT))
}

// common js
async function commonJs() {
    return gulp.src(SRC_LIST.common_js)
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(If(IS_PROD, Uglify()))
        // .pipe(If(IS_PROD, Concat('main.js')))
        .pipe(gulp.dest(OUT_PUT + '/common/js'))
        .pipe(Connect.reload())
}

// common css
async function commonCss() {
    return gulp.src(SRC_LIST.common_css)
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(gulp.dest(OUT_PUT + '/common/css'))
        .pipe(Connect.reload())
}

// js
async function js() {
    return gulp.src(SRC_LIST.js)
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(babel())
        // .pipe(If(IS_PROD, Concat('main.js')))
        .pipe(If(IS_PROD, Sourcemaps.init()))
        .pipe(If(IS_PROD, Uglify()))
        .pipe(If(IS_PROD, Sourcemaps.write('../maps')))
        .pipe(gulp.dest(OUT_PUT + '/js'))
        .pipe(Connect.reload())
}

// less
async function less() {
    return gulp.src(SRC_LIST.less)
        .pipe(Sourcemaps.init())
        .pipe(Less())
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(If(IS_PROD, MinifyCss()))
        .pipe(If(IS_PROD, Sourcemaps.write('../maps')))
        .pipe(gulp.dest(OUT_PUT + '/css'))
        .pipe(Connect.reload())
}

// scss
async function scss() {
    return gulp
        .src(SRC_LIST.scss)
        .pipe(SassImport())
        .pipe(Sass({
            outputStyle: 'expanded'
        }))
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(If(IS_PROD, MinifyCss()))
        .pipe(If(IS_PROD, Sourcemaps.write('../maps')))
        .pipe(gulp.dest(OUT_PUT + '/css'))
        .pipe(Connect.reload())
}

// css
async function css() {
    return gulp
        .src(SRC_LIST.css)
        .pipe(Preprocess({
            context: CONTEXT,
        }))
        .pipe(If(IS_PROD, MinifyCss()))
        .pipe(If(IS_PROD, Sourcemaps.write('../maps')))
        .pipe(gulp.dest(OUT_PUT + '/css'))
        .pipe(Connect.reload())
}

// images
async function images() {
    return await gulp.src(SRC_LIST.images)
        .pipe(If(IS_PROD, Cache(Imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [Pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))))
        .pipe(gulp.dest(OUT_PUT + '/images'))
}

// clean
async function clean() {
    // 不设置allowEmpty: true会报File not found with singular glob
    return await gulp.src(OUT_PUT, {
        allowEmpty: true
    }).pipe(Clean())
}

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

// mock
async function mock() {
    var stream = nodemon({
        script: './mock/server.js',
        ext: 'js'
    })

    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function () {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10) // restart the server in 10 seconds
        })
    gulp.watch(['./mock/db.js', './mock/**'])
}

gulp.task('clean', clean)
gulp.task('html', html)
gulp.task('assets', assets)
gulp.task('commonJs', commonJs)
gulp.task('commonCss', commonCss)
gulp.task('js', js)
gulp.task('less', less)
gulp.task('scss', scss)
gulp.task('css', css)
gulp.task('images', images)
gulp.task('server', server)
gulp.task('sprite', sprite)
gulp.task('mock', mock)

gulp.task('sources', gulp.series(gulp.parallel('html', 'assets', 'commonJs', 'commonCss', 'js', 'less', 'scss', 'css', 'images')))

// watch
gulp.task('watch', async () => {
    gulp.watch(SRC_LIST.html, gulp.series('html'))
    gulp.watch(SRC_LIST.common_js, gulp.series('commonJs'))
    gulp.watch(SRC_LIST.common_css, gulp.series('commonCss'))
    gulp.watch(SRC_LIST.js, gulp.series('js'))
    gulp.watch(SRC_LIST.less, gulp.series('less'))
    gulp.watch(SRC_LIST.scss, gulp.series('scss'))
    gulp.watch(SRC_LIST.css, gulp.series('css'))
    gulp.watch(SRC_LIST.images, gulp.series('images'))
})

gulp.task('dev', gulp.series(gulp.parallel('sources', 'server', 'watch')))
gulp.task('prv', gulp.series('sources'))
gulp.task('build', gulp.series('sources'))

spinner.stop()