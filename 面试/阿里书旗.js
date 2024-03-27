/**
 * 合并区间
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (arr) {
  let newArr = [...arr].sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i][1] >= newArr[i + 1][1]) {
      newArr.splice(i + 1, 1);
      i--;
      continue;
    }

    if (newArr[i][1] < newArr[i + 1][0]) {
      continue;
    }

    if (newArr[i][1] >= newArr[i + 1][0] && newArr[i][1] < newArr[i + 1][1]) {
      newArr[i] = [newArr[i][0], newArr[i + 1][1]];
      newArr.splice(i + 1, 1);
      i--;
      continue;
    }
  }
  return newArr;
};
