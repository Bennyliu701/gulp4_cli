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
      EXTEND: '{"LOGIN_ROOT": "//auth-test.youzu.com", "FORGET_PWD_ROOT": "//qam.youzu.com/mobile/findpwd"'
   },
   prv: {
      OUT_PUT: './build',
      NODE_ENV: 'prv',
      BASE_API: 'https://prv',
      HOME_ROOT: '',
      STATIC_ROOT: 'https://qapic.youzu.com/youzu/web/mulink',
      COMMON_ROOT: 'https://qapic.youzu.com/youzu/web/mulink/common',
      EXTEND: '{"LOGIN_ROOT": "//auth.youzu.com", "FORGET_PWD_ROOT": "//m.youzu.com/mobile/findpwd"'
   },
   prod: {
      OUT_PUT: './build',
      NODE_ENV: 'prod',
      BASE_API: 'https://',
      HOME_ROOT: '',
      STATIC_ROOT: 'https://pic.youzu.com/youzu/web/mulink',
      COMMON_ROOT: 'https://pic.youzu.com/youzu/web/mulink/common',
      EXTEND: '{"LOGIN_ROOT": "//auth.youzu.com", "FORGET_PWD_ROOT": "//m.youzu.com/mobile/findpwd"'
   },
   sprite: {
      PATH_NAME: 'example-sprite',
   },
   mock: {
      PORT: '3001',
   }
 }