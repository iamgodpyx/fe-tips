const fakeRequest = (time, val) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(val), console.log(`第${val}个任务完成`);
    }, time * 1000);
  });
};

const reqArr = [
  () => fakeRequest(7, 1),
  () => fakeRequest(9, 2),
  () => fakeRequest(10, 3),
  () => fakeRequest(1, 4),
  () => fakeRequest(1, 5),
];

const limitReq = (limit, reqArr) => {
  const queue = [];
  let currentIndex = 0;

  const run = async () => {
    // console.log("currentIndex", currentIndex);
    // console.log("queue", queue.length);
    if (queue.length === 0) return;
    queue
      .shift()()
      .then(() => {
        if (currentIndex < reqArr.length - 1 && queue.length < limit) {
          queue.push(reqArr[currentIndex + 1]);
          currentIndex++;
          run();
        }
      });
      run();
  };
  const times = Math.min(limit, reqArr.length);
  for (let i = 0; i < times; i++) {
    queue.push(reqArr[i]);
    currentIndex = i;
  }

  run();
};

console.log(limitReq(3, reqArr));
