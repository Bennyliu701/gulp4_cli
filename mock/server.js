const jsonServer = require('json-server')
const chalk = require('chalk')
const db = require('./db.js')
const routes = require('./routes.js')
const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()
const rewriter = jsonServer.rewriter(routes)
const config = require('../config/config')
const port = config.mock.PORT;

server.use(middlewares)
// 将 POST 请求转为 GET
server.use((request, res, next) => {
    request.method = 'GET';
    next();
})
server.use(rewriter) // 注意：rewriter 的设置一定要在 router 设置之前
server.use(router)
server.listen(port, () => {
    console.log(chalk.green('open mock server at http://localhost:' + port))
})