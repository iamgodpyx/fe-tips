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
function compareVersion(v1, v2) {
  let arr1 = v1.replace("beta.", "").split(".");
  let arr2 = v2.replace("beta.", "").split(".");

  let j = 0;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] > arr2[j]) {
      return true;
    }

    if (arr1[i] < arr2[j]) {
      return false;
    }

    if (arr1[i] === arr2[j]) {
      j++;
      continue;
    }

    if (!arr2[j]) {
      return true;
    }
  }

  if (j > 0) {
    return false;
  }
  return "same";
}

console.log(compareVersion("5.0.1", "5.0.1.beta.3"));
console.log(compareVersion("5.0.1", "5.0.1.beta.3"));
console.log(compareVersion("6.0", "5.0.1.beta.3"));
console.log(compareVersion("5.0.1", "5.0.1.beta.3"));
