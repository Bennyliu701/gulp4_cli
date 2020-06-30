// import Cookies from 'js-cookie';
const Cookies = require('js-cookie');

/**
 * @desc 获取Cookies
 */
module.exports.getCookie =  function getCookie(name) {
    return Cookies.get(name)
}

/**
 * @desc 设置Cookies
 */
module.exports.setCookie =  function (name, value, domain, path, hour) {
    Cookies.set(name, value, {
        expires: 7,
        path: path
    });
}

/**
 * @desc 设置Cookies
 */
module.exports.clearCookie =  function (name, value, domain, path, hour) {
    Cookies.remove(name);
}