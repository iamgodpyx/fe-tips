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

const limitReq = (limit, reqArr, result) => {
  return new Promise((resolve, reject) => {
    const queue = [];
    const result = [];
    let currentIndex = 0;
    let doingIndex = 0;

    const run = () => {
      if (queue.length === 0) return;
      queue
        .shift()()
        .then((res) => {
          doingIndex++;
          // 最后一个promise执行完毕
          if (doingIndex === reqArr.length) {
            result.push(res);
            resolve(result);
            return;
          }
          // 不再新把promise放入queue
          if (currentIndex === reqArr.length - 1) {
            result.push(res);
          }
          // 还在把promise放入queue
          if (currentIndex < reqArr.length - 1 && queue.length < limit) {
            result.push(res);
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
  });
};

limitReq(3, reqArr).then((res) => console.log(111111,res));

// function get(id) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(id);
//       console.log(`第${id}个任务完成`);
//     }, id * 1000);
//   });
// }

// function gets(ids, max) {
//   return new Promise((resolve) => {
//     const res = [];
//     let loadcount = 0;
//     let curIndex = 0;
//     function load(id, index) {
//       return get(id).then(
//         (data) => {
//           loadcount++;
//           if (loadcount === ids.length) {
//             res[index] = data;
//             resolve(res);
//           } else {
//             curIndex++;
//             load(ids[curIndex]);
//           }
//         },
//         (err) => {
//           res[index] = err;
//           loadcount++;
//           curIndex++;
//           load(ids[curIndex]);
//         }
//       );
//     }

//     for (let i = 0; i < max && i < ids.length; i++) {
//       curIndex = i;
//       load(ids[i], i);
//     }
//   });
// }

// const getList  = async () => {
//   const a = await gets([1, 2, 3, 4, 5], 2);
//   return a
// }

// gets([1, 2, 3, 4, 5], 2);
