"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

// 假设当前执行指令 npm run dev

/* 获取config变量方式1 */
console.log('dev'); // expect console.log('dev')

var loginUrl = JSON.parse('{"LOGIN_ROOT": "//auth-test.youzu.com", "FORGET_PWD_ROOT": "//qam.youzu.com/mobile/findpwd"').LOGIN_ROOT; // expect var loginUrl = '//auth-test.youzu.com'

/* 获取config变量方式2 */

(void 0).Env = 'qa'; // expect  this.Env = 'qa'

/* ES6 test */

var a = 1;
var b = 2;

var foo = function foo() {
  return a + b;
};

function test() {
  return _test.apply(this, arguments);
}

function _test() {
  _test = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var c, d;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            c = 10;
            _context.next = 3;
            return foo();

          case 3:
            _context.t0 = _context.sent;
            _context.t1 = c;
            d = _context.t0 + _context.t1;
            return _context.abrupt("return", d);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _test.apply(this, arguments);
}

test().then(function (res) {
  console.log(res);
});
/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */

var color = [1, 2, 3, 4, 5];
var result = (0, _filter["default"])(color).call(color, function (item) {
  return item > 2;
});
/* --- Class 語法糖 --- */

var Circle = function Circle() {
  (0, _classCallCheck2["default"])(this, Circle);
};
/* --- Promise 物件 --- */


var promise = _promise["default"].resolve();