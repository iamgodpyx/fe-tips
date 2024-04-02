// /**
//  * 合并区间
//  * @param {number[][]} intervals
//  * @return {number[][]}
//  */
// var merge = function (arr) {
//   let newArr = [...arr].sort((a, b) => a[0] - b[0]);

//   for (let i = 0; i < newArr.length - 1; i++) {
//     if (newArr[i][1] >= newArr[i + 1][1]) {
//       newArr.splice(i + 1, 1);
//       i--;
//       continue;
//     }

//     if (newArr[i][1] < newArr[i + 1][0]) {
//       continue;
//     }

//     if (newArr[i][1] >= newArr[i + 1][0] && newArr[i][1] < newArr[i + 1][1]) {
//       newArr[i] = [newArr[i][0], newArr[i + 1][1]];
//       newArr.splice(i + 1, 1);
//       i--;
//       continue;
//     }
//   }
//   return newArr;
// };





// 请通过代码实现大整数（可能比Number.MAX_VALUE大）相加运算
// function add(str1, str2) {
//   let arr1 = str1.length >= str2.length ? str1.split('') : str2.split('');
//   let arr2 = str1.length < str2.length ? str1.split('') : str2.split('');
//   let temp = 0;
//   const result = [];


//   let j = arr2.length - 1;
//   for (let i = arr1.length - 1; i >= 0; i--) {
//     if (arr2[j]) {
//       let count = Number(arr1[i]) + Number(arr2[j]) + temp;
//         j--;
//       if (count >= 10) {
//         temp = 1;
//         result.push(String(count)[1]);
//       } else {
//         temp = 0;
//         result.push(String(count));
//       }
//       continue;
//     }

//     let count = Number(arr1[i]) + temp;
//       if (count >= 10) {
//         temp = 1;
//         result.push(String(count)[1]);
//       } else {
//         temp = 0;
//         result.push(String(count));
//       }
//   }

//   if (temp) {
//     result.push(temp);
//   }

//   return result.reverse().join('')
// }

// // 使用示例
// console.log(add("123456789012345678901234567890", "987654321098765432109876543210")); // 输出 1111111111111111111111111111100
// add('1234', '2142')
// add('1242342424123', '0')
// add('0', '1242342424123')
// add('0123123123', '023421423')



// <!-- 其中 ?t=6000 表示改请求会延迟6000ms返回，依次类推 -->
// <!DOCTYPE html>
// <html lang="en">
// <head>
// 	<link rel="stylesheet" href="./a.css?t=6000">
// </head>
// <body>
//   <h1>第一行</h1>
//   <link rel="stylesheet" href="./b.css?t=4000">
//   <h1 id="second">第二行</h1>
//   <script src="./c.js"></script>
// </body>
// </html>

// // a.css:
// body {
//     background-color: blue;
// }

// // b.css:
// #second {
//     color: red;
// }

// // c.js
// (() => {
//     console.log('console from c.js');
// })(); 