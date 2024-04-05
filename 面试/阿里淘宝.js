// 1. 获取url的query，给你一个天猫的地址
// 输出一个对象，对象的key是query的key，value是query的value

// 2.给一个对象，去替换模版字符串中的value
// 例如
// 输入
// {
//   name: '张三',
//   age: 18
// }
// 模版字符串
// 你好，${name}，你今年${age}岁了
// 输出
// 你好，张三，你今年18岁了

// 3.判断a字符串中有没有b字符串，不能使用类似indexOf api
// 例如
// a = 'abcdefg'
// b = 'cde'
// 输出true
// a = 'abcdefg'
// b = 'cdea'
// 输出false

// 实现一个JS的版本号比较函数
// 示例：6.0 > 5.0.2 > 5.0.1 > 5.0.1.beta.3 > 5.0.0
// function compareVersion(v1, v2) {
//   let arr1 = v1.replace("beta.", "").split(".");
//   let arr2 = v2.replace("beta.", "").split(".");

//   let j = 0;

//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] > arr2[j]) {
//       return true;
//     }

//     if (arr1[i] < arr2[j]) {
//       return false;
//     }

//     if (arr1[i] === arr2[j]) {
//       j++;
//       continue;
//     }

//     if (!arr2[j]) {
//       return true;
//     }
//   }

//   if (j > 0) {
//     return false;
//   }
//   return "same";
// }

// console.log(compareVersion("5.0.1", "5.0.1.beta.3"));
// console.log(compareVersion("5.0.1", "5.0.1.beta.3"));
// console.log(compareVersion("6.0", "5.0.1.beta.3"));
// console.log(compareVersion("5.0.1", "5.0.1.beta.3"));

// class Schedule {
//   constructor() {
//     this.queue = [];
//     this.arr = [];
//   }

//   add() {

//   }

//   run() {}
// }

// const schedule = new Schedule();

// const promiseFunc = (time, val) => {
//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       res(val);
//     }, time);
//   });
// };

// schedule.add(promiseFunc(3000, 1))
// schedule.add(promiseFunc(5000, 2))
// schedule.add(promiseFunc(1000, 3))
// schedule.add(promiseFunc(2000, 4))

// JS实现一个带并发限制的异步调度器Scheduler，
// 保证同时运行的任务最多有两个。
// 完善代码中Scheduler类，
// 使得以下程序能正确输出

// class Scheduler {
//   constructor(max) {
//     this.max = max;
//     this.queue = [];
//     this.running = 0;
//   }

//   add(task) {
//     return new Promise((res) => {
//       task.resolve = res;

//       if (this.running < this.max) {
//         this.run(task);
//       } else {
//         this.queue.push(task);
//       }
//     });
//   }

//   async run(task) {
//     if (task) {
//       this.running++;
//       const result = await task();
//       task.resolve(result)
//       // await task();
//       // task.resolve();
//       this.running--;
//       const fn = this.queue.shift();
//       this.run(fn);
//     }
//   }
// }

class Scheduler {
  constructor(max) {
    this.max = max;
    this.queue = [];
    this.doing = 0;
  }

  add(asyncFunc) {
    return new Promise((res) => {
      asyncFunc.resolve = res;
      if (this.doing < this.max) {
        this.run(asyncFunc);
      } else {
        this.queue.push(asyncFunc);
      }
    });
  }

  async run(asyncFunc) {
    if (asyncFunc) {
      this.doing++;
      const resp = await asyncFunc();
      asyncFunc.resolve(resp);
      this.doing--;
      const newAsyncFunc = this.queue.shift();
      this.run(newAsyncFunc);
    }
  }
}

const scheduler = new Scheduler(2);

// const timeout = (time) =>
//   new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// const addTask = (time, order) => {
//   scheduler.add(() => timeout(time)).then(() => console.log(order));
// };

const timeout = (time, val) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, time);
  });
const addTask = (time, order) => {
  scheduler.add(() => timeout(time, order)).then((val) => console.log(val));
};

addTask(1000, "1");
addTask(9000, "2");
addTask(3000, "3");
addTask(4000, "4");
// output: 2 3 1 4

// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4
