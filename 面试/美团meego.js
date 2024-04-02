// 输出
// console.log("start");
// setTimeout(() => {
//   console.log("timeout");
// }, 0);
// new Promise((resolve, reject) => {
//   console.log("promise测试");
//   resolve();
//   console.log("promise测试 after for-loop");
// })
//   .then(() => {
//     console.log("promise测试1");
//   })
//   .then(() => {
//     console.log("promise测试2");
//   });
// function fn1() {
//   console.log("await 1");
// }
// async function fn() {
//   console.log("fn start");
//   const res = await fn1();
//   console.log("fn end");
// }
// fn();
// console.log("end");

// let a = [1, 2, 3, 4, 5];
// let b = [2, 3, 4, 2, 1];

// for (let i of a) {
//     for (let j of b) {
//         if (j > i) {
//             break
//         }
//         console.log(i,j);
//     }
// }

// 算法题
// const nodeList = [
//   { id: 1, children: [{ id: 10 }, { id: 11 }] },
//   { id: 4, children: [{ id: 13 }, { id: 16 }] },
//   { id: 7, children: [{ id: 20 }, { id: 19 }] },
// ];

// // 只有一层children
// // tree节点
// // 给一个数组，比如[10, 7]
// // 返回:
// const newTree = [
//   { id: 1, children: [{ id: 10 }] },
//   { id: 7, children: [{ id: 20 }, { id: 19 }] },
// ];

const nodeList = [
    { id: 1, children: [{ id: 10 }, { id: 11 }] },
    { id: 4, children: [{ id: 13 }, { id: 16 }] },
    { id: 7, children: [{ id: 20 }, { id: 19 }] },
  ];

const returnTree = (nodeList, arr) => {
  const result = [];

  let i = 0;
  while (i < arr.length) {
    for (let m = 0; m < nodeList.length; m++) {
      if (nodeList[m].id === arr[i]) {
        result.push(nodeList[m]);
        i++;
        m = 0;
        break;
      }
      for (let n = 0; n < nodeList[m].children.length; n++) {
        if (nodeList[m].children[n].id === arr[i]) {
          result.push({
            id: nodeList[m].id,
            children: [{ id: nodeList[m].children[n].id }],
          });
          i++;
          m = 0;
          n = 0;
          break;
        }
      }
    }
  }

  return result;
};

console.log(JSON.stringify(returnTree(nodeList, [10, 7])));
