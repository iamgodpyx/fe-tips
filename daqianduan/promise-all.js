// Promise.myAll = function (arr) {
//   const result = [];
//   return new Promise((res, rej) => {
//     for (let i = 0; i < arr.length; i++) {
//       arr[i]
//         .then((data) => {
//           result.push(data);
//           if (result.length === arr.length) {
//             res(result);
//           }
//         })
//         .catch((err) => rej());
//     }
//   });
// };

Promise.myAll = function (arr) {
    let result = [];
    let num = 0
    return new Promise((resolve, reject) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i].then(res => {
                result[i] = res;
                num++;
                if (num === arr.length) resolve(result);
            }, rej => {
                reject(rej)
            })
        }
    })
}

  //测试
  const p1 = new Promise((res, rej) => {
    setTimeout(() => {
        res('任务1成功')
    }, 1000);
})

const p2 = new Promise((res, rej) => {
    setTimeout(() => {
        res('任务2成功')
    }, 500);
})

const p3 = new Promise((res, rej) => {
    setTimeout(() => {
        rej('任务3失败')
    }, 2000);
})

Promise.myAll([p1, p2, p3])
    .then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })


