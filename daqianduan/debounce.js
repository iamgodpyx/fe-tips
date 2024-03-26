const debounce = (func, time) => {
  let temp;
  return function (...args) {
    clearTimeout(temp);
    temp = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
};

const throttle = (func, time) => {
  let temp = Date.now();

  return function (...args) {
    let cur = Date.now();
    if (cur - temp >= time) {
      func.apply(this, args);
    }
    time = Date.now();
  };
};

const debounce1 = (fn, time) => {
  let temp;
  return function (...args) {
    clearTimeout(temp);
    temp = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
};

const throttle1 = (fn, time) => {
  let now = Date.now();
  return function (...args) {
    let cur = Date.now();
    if (cur - now >= time) {
      fn.apply(this, args);
    }
    now = cur;
  };
};
