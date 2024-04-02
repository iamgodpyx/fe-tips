// 遍历返回树结构
const covertTree = (root) => {
  // let root = document.querySelector("#root");
  let tree = {};

  if (!root.val) {
    return {};
  }

  const dfs = (root) => {
    let subtree = { val: root.val, children: [] };

    if (root.children) {
      root.children.forEach((item, index) => {
        subtree.children.push(dfs(item));
      });
    }

    return subtree;
  };

  tree = dfs(root);
  return tree;
};

// 判断节点间的层级
const treeDeps = (node1, node2) => {
  // const node1 = document.querySelector(`.${class1}`);
  // const node2 = document.querySelector(`.${class2}`);

  const dfs = (node1, num = 0) => {
    if (node1.val === node2.val) {
      return num;
    }
    if (node1.children) {
      num++;

      for (let i = 0; i < node1.children.length; i++) {
        const result = dfs(node1.children[i], num);
        if (result !== -1) {
          return result;
        }
      }
    }

    return -1;
  };

  const result = dfs(node1, 0);

  return result;
};

// const treeDeps = (node1, node2) => {
//   const dfs = (node, target, depth = 0) => {
//     if (node.val === target.val) {
//       return depth;
//     }

//     if (node.children) {
//       for (let i = 0; i < node.children.length; i++) {
//         const child = node.children[i];
//         const result = dfs(child, target, depth + 1);
//         if (result !== -1) {
//           return result;
//         }
//       }
//     }

//     return -1;
//   };

//   const result = dfs(node1, node2);

//   return result;
// };

let tree = {
  val: 123,
  children: [
    {
      val: 1223,
      children: [
        {
          val: "as2dfsad",
        },
        {
          val: "asdf32sad",
        },
        {
          val: "a123sdfsad",
        },
        {
          val: "asd12fsad",
        },
      ],
    },
    {
      val: 13,
      children: [
        {
          val: "123",
        },
      ],
    },
    {
      val: 1212323,
      children: [],
    },
  ],
};

let result = covertTree(tree);

let result1 = treeDeps(tree, {
  val: "a123sdfsad",
});

// console.log(result);
console.log(result1);

// 轮询、节流、防抖、大数相加、双击、裁切数组、上一次面试的题

class Poll {
  timer = undefined;
  fn = undefined;
  delay = 2000;

  constructor(fn, delay) {
    this.fn = fn;
    this.delay = delay;
  }

  start() {
    const cb = () => {
      this.fn.apply(null);
      this.start();
    };

    this.timer = setTimeout(cb, this.delay);
  }

  stop() {
    clearTimeout(this.timer);
  }
}

const debounce = (fn, delay) => {
  // 每隔 50ms, 如果有定时器就会中断
  let timer;

  const callback = () => {
    // 清除原来的定时器
    clearTimeout(timer);

    // 重置定时器
    timer = setTimeout(() => {
      fn();
    }, delay);
  };

  return callback;
};

const throttle = (fn, delay) => {
  let startTime;

  // 每次调用 fn，只会触发第一次
  const callback = () => {
    if (!startTime || startTime + delay < +new Date()) {
      startTime = +new Date();
      fn();
    }
  };

  return callback;
};

// 2345 -> 5432
const tranformToMax = (num) => {
  let arr = [];

  // 拿到每一位的数字
  while (num) {
    // 拿到它的余数
    const per = num % 10;
    num = num / 10;
    arr.push(per);
  }

  // 对拿到的数字进行排序
  arr.sort((a, b) => b - a);

  // 组装
  let res = 0;
  arr.forEach((per) => {
    res += per * 10;
  });

  return res;
};

const doubleClick = (dom, fn, delay) => {
  let mark;

  const clear = () => {
    clearTimeout(mark);
    mark = undefined;
  };

  const onClick = () => {
    if (!mark) {
      mark = setTimeout(clear, delay);
    } else {
      fn();
    }
  };

  dom.addEventListener("click", onClick);

  return () => {
    dom.removeEventListener("click", onClick);
  };
};

// 1.对一个数组进行均分, 均分为大小为m的多段
// 测试数组 let arr = [1, 2, 3, 4, 5, 1, 1], m=2.
// 结果存储到一个新数组, 一次输出: [[1, 2], [3, 4], [5, 1], [1]].

const transformArr = (nums, m) => {
  let k = 0;

  const res = [];
  let arr = [];

  for (let i = 0; i < nums.length; i++) {
    arr.push(nums[i]);

    if (++k % m === 0) {
      res.push(arr);
      arr = [];
    } else if (i === nums.length - 1) {
      res.push(arr);
    }
  }

  return res;
};

// 大数相加
const mutiple = (num1, num2) => {
  let carry = 0;

  const maxNum = num1.length > num2.length ? num1 : num2;

  // 000234
  // 123445
  let p = num1.length - 1;
  let q = num2.length - 1;

  let i = maxNum - 1;

  let res = "";

  while (i >= 0) {
    const n1 = num1[p] || 0;
    const n2 = num2[q] || 0;

    const curNum = n1 * n2 + carry;

    res = String(curNum % 10) + res;
    carry = (curNum / 10) | 0;

    i--;
  }

  return res;
};
