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

Function.prototype.myBind = function(target, ...args) {
    target = target || {};
    const symbolKey = Symbol();
    target[symbolKey] = this;
    return function(...innerArgs) {
        const res = target[symbolKey](...args, ...innerArgs);
        return res;
    }
}
