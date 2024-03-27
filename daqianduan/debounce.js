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

// const debounce1 = (fn, time) => {
//   let temp;
//   return function (...args) {
//     clearTimeout(temp);
//     temp = setTimeout(() => {
//       fn.apply(this, args);
//     }, time);
//   };
// };

// const throttle1 = (fn, time) => {
//   let now = Date.now();
//   return function (...args) {
//     let cur = Date.now();
//     if (cur - now >= time) {
//       fn.apply(this, args);
//     }
//     now = cur;
//   };
// };





// 实现一个 promise 的调度器类Scheduler，限制同一时刻只能执行2个task
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}


class Scheduler {
  constructor(count) {
    this.count = count;
    this.queue = [];
    this.index = 0;
    this.result = []
    this.arr = [];
  }


  add(promiseFunc) {
    this.arr.push(promiseFunc);
    if (this.queue.length < this.count) {
      this.queue.push(this.arr.pop());
    }
    this.run(promiseFunc);
  }

  run(promise) {
    return new Promise((resolve, reject) => {
      if (this.index < this.count) {
        this.index++;
        this.queue.pop()().then(
          res => this.result.push(res)
        ).catch(err => this.result.push(err))
          .finally(
            () => {
              index--
              if (this.arr.length) {
                this.queue.push(this.arr.pop());
                this.run(this.queue.pop())

              }
            }
          )
      }
    }
  }
}

// 限制同一时刻只能执行2个task
addTask(4000, '1')
addTask(3500, '2')
addTask(4000, '3')
addTask(3000, '4')