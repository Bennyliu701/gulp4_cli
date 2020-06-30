// 假设当前执行指令 npm run dev
/* 获取config变量方式1 */
console.log('dev')
// expect console.log('dev')
var loginUrl = JSON.parse('{"LOGIN_ROOT": "//auth-test.youzu.com", "FORGET_PWD_ROOT": "//qam.youzu.com/mobile/findpwd"}').LOGIN_ROOT;
// expect var loginUrl = '//auth-test.youzu.com'

/* 获取config变量方式2 */
let Env = 'qa'
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


