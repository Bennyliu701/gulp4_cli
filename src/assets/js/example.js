// 假设当前执行指令 npm run dev
/* 获取config变量方式1 */
console.log('/* @echo NODE_ENV */')
// expect console.log('dev')
var loginUrl = JSON.parse('/* @echo EXTEND */').LOGIN_ROOT;
// expect var loginUrl = '//auth-test.youzu.com'

/* 获取config变量方式2 */
// @if NODE_ENV = 'dev'
let Env = 'qa'
// @endif
// @if NODE_ENV = 'prv'
let Env = 'prv'
// @endif
// @if NODE_ENV = 'prod'
let Env = ''
// @endif
// expect  Env = 'qa'

/* ES6 test */
const a = 1;
const b = 2;

let foo = function () {
   return a+b
}

async function test() {
   let c = 10;
   let d = await foo() + c
   return d;
}

test().then(res => {
   console.log(res)
})

/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */
let color = [1, 2, 3, 4, 5];
let result = color.filter((item) => item > 2);

/* --- Class 語法糖 --- */
class Circle {}

/* --- Promise 物件 --- */
const promise = Promise.resolve();


