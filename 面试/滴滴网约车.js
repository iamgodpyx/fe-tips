// class EventEmitter {
//   constructor() {
//     this.map = {};
//   }

//   on(name, task) {
//     if (this.map[name]) {
//       this.map[name].push(task);
//     } else {
//       this.map[name] = [task];
//     }
//   }

//   emit(name, ...args) {
//     if (this.map[name]) {
//       this.map[name].forEach(async (val) => {
//         try {
//           await val.apply(this, args);
//         } catch (error) {}
//       });
//     }
//   }

//   off(name, task) {
//     let arr = this.map[name];
//     if (arr) {
//       let index = arr.indexOf(task);

//       if (index !== -1) {
//         arr.splice(index, 1);
//       }
//     }
//   }
// }

// const eventBus = new EventEmitter();
// const task1 = (time) => {
//   console.log(`Task1 took ${time}s`);
// };
// const task2 = () => {
//   console.log("task2");
// };
// const task3 = () => {
//   console.log("task3");
// };

// eventBus.on("task", task1);
// eventBus.on("task", task2);
// eventBus.on("task", task3);
// eventBus.off("task", task1);
// setTimeout(() => {
//   eventBus.emit("task", 3000); // 输出：task2、task3
// }, 1000);

// 题目1：
var a = 100;
function create() {
  var a = 200;
  return function () {
    alert(a);
  };
}
var fn = create();
fn();

//   题目2：
var a = 100;
function invoke(fn) {
  var a = 200;
  fn();
}
function fn() {
  alert(a);
}
invoke(fn);
