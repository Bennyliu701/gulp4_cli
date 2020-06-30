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
