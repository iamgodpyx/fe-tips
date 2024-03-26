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


Function.prototype.myApply = function(target, args) {
  target = target || window;
  const foo = Symbol();
  target[foo] = this;

  const result = target[foo](...args);
  delete target[foo];
  return result;
}

Function.prototype.myBind = function(target, ...args) {
  target = target || {};
  const foo = Symbol();
  target[foo] = this;

  return function(...val) {
    const result = target[foo](...args, ...val);
    return result;
  }
}
