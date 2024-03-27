// const arr1 = [1, 2, 3, 2];

// const arr2 = [2, 3, 4, 2];

// // 交集
// const func1 = (arr1, arr2) => {
//   const temp1 = new Set(arr1);
//   const temp2 = new Set(arr2);
//   const result = [];

//   for (let i of temp1) {
//     if (temp2.has(i)) {
//       result.push(i);
//     }
//   }

//   return result;
// };

// // 并集
// const func2 = (arr1, arr2) => {
//     return [...new Set([...arr1, ...arr2])]
// }

// console.log(func1(arr1, arr2));
// console.log(func2(arr1, arr2));

const a = new Map();

a.set(1,2)
a.set(1,5)

console.log(a);
