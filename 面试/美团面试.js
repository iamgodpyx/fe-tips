// 输出
// async function test() {
//     console.log(1111);
//     await test2();
//     console.log(2222);
//   }

//   async function test2() {
//     console.log(3333);
//     return Promise.resolve(1);
//   }

//   function main() {
//     console.log(4444);
//     test();
//     console.log(55555);
//   }

//   main();

//算法题
//遍历多叉树

const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        {
          value: 3,
        },
      ],
    },
    {
      value: 3,
      children: [
        {
          value: 3,
        },
      ],
    },
    {
      value: 4,
      children: [
        {
          value: 3,
        },
      ],
    },
  ],
};

// 输出 1-2-3， 1-3-3， 1-4-3
const result = [];
function printTree(tree, path = "") {
  const newPath = path !== "" ? `${path}-${tree.value}` : `${tree.value}`;

  if (tree.children) {
    tree.children.forEach((child) => {
      printTree(child, newPath);
    });
  } else {
    result.push(newPath);
  }
}

printTree(tree);
console.log(result);
