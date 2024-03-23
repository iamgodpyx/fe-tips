// // //数组拍平 flatternArray(arr,count)

// // flatternArray([1, 2, 3, [4, 5]], 1); //[1,2,3,4,5]

// // flatternArray([1, 2, 3, [4, [5]]], 1); //[1,2,3,4,[5]]

// const flattenArray = (arr, count) => {
//   return arr.flat(count);
// };

// function flatternArray(arr, count) {
//   if (count === 0) {
//     return arr;
//   }

//   const result = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) {
//       const flattened = flatternArray(arr[i], count - 1);
//       result.push(...flattened);
//     } else {
//       result.push(arr[i]);
//     }
//   }

//   return result;
// }

// const a = flattenArray([1, 2, 3, [4, 5]], 1);
// const b = flattenArray([1, 2, 3, [4, [5]]], 1);

// console.log(a, b);


var longestCommonPrefix = function(strs) {
    const _arr = [...strs]
    const shortStr = _arr.sort((a, b) => a.length - b.length)[0];
    let result = ''

    for (let i = 0; i < shortStr.length; i++) {
       const _result = result + shortStr[i];
       console.log(_result,123, result, shortStr[i])
        if (strs.some(item => !item.startsWith(_result))) {
            return result;
        } else {
            result = _result;
        }
    }
    return result;
};

a = longestCommonPrefix([""])

console.log(a);