// 滑动窗口
// 实现一个去除e、df字符串的函数，一次遍历完成
// 例如 abcdefg => abcg
// adddefffgfe -> agf
// dddefffaddeff -> a

const foo = (str) => {
  let arr = str.split("");

  console.log(arr.join(""));

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "e") {
      arr.splice(i, 1);
    }
  }

  console.log(arr.join(""));

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "d" && arr[i + 1] === "f") {
      arr.splice(i, 2);
    }
  }

  return arr.join("");
};

console.log(foo("abcdefg"));
console.log(foo("adddefffgfe"));
console.log(foo("dddefffaddeff"));
