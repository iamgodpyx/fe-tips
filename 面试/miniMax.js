const taskList = new Array(100).fill(0).map((val, index) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        console.log(index);
      }, 1000);
    });
  };
});

const foo = async (promises, count) => {
  let index = 0;

  return new Promise((res, rej) => {
    const run = async (promiseFunc) => {
      if (promiseFunc) {
        await promiseFunc();
        index++;
        run(promises[index]);
      } else {
        res();
      }
    };

    const num = Math.min(count, promises.length);
    for (let i = 0; i < num; i++) {
      index++;
      run(promises[i]);
    }
  });
};

foo(taskList, 5).then((res) => {
  console.log(123);
});




// 二面：图dfs
