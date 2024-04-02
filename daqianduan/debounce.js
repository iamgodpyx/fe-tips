// const debounce = (func, time) => {
//   let temp;
//   return function (...args) {
//     clearTimeout(temp);
//     temp = setTimeout(() => {
//       func.apply(this, args);
//     }, time);
//   };
// };

// const throttle = (func, time) => {
//   let temp = Date.now();

//   return function (...args) {
//     let cur = Date.now();
//     if (cur - temp >= time) {
//       func.apply(this, args);
//     }
//     time = Date.now();
//   };
// };

function debounce (fn, time) {
  let temp;

  return function(...args) {
    clearTimeout(temp);

    temp = setTimeout(() => {
      fn.call(this, ...args);
    }, time)
  }
}



function throttle (fn, time) {
  let start = Date.now();

  return function(...args) {
    let current = Date.now();

    if (current - start >= time) {
      fn.call(this, ...args);
    }

    start = Date.now();
  }
}