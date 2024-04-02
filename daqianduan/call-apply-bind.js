// call

Function.prototype.myCall = function (target, ...args) {
  target = target || window;
  let fn = Symbol();
  target[fn] = this;
  let res = target[fn](...args);
  delete target[fn];
  return res;
};

Function.prototype.myApply = function (target, args) {
  target = target || window;
  let fn = Symbol();
  target[fn] = this;
  let res = target[fn](...args);
  delete target[fn];
  return res;
};

Function.prototype.myBind = function (target, ...args) {
  target = target || {};
  const symbolKey = Symbol();
  target[symbolKey] = this;
  return function (...innerArgs) {
    const res = target[symbolKey](...args, ...innerArgs);
    return res;
  };
};

Function.prototype.myBind = function (target, ...args) {
  const fn = Symbol();
  target[fn] = this;

  return function (...args1) {
    const res = target[fn](...args, ...args1);
    return res;
  };
};

function foo(a, b) {
  console.log(a + b);
}

let a = foo.myBind(this, 12341234);
a(-12312312312);
