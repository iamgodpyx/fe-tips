// const sendRequest = (
//   requestList: Array<Promise<any>>,
//   limits: number,
//   callback
// ) => {
//   // 执行队列
//   const promises = [...requestList];
//   // 最大并发数
//   const concurrentNum = Math.min(limits, requestList.length);
//   // 当前并发数
//   let concurrentCount = 0;

//   // 初次执行的任务
//   const runTaskNeeded = () => {
//     let i = 0;
//     while (i < concurrentNum) {
//       i++;
//       runTask();
//     }
//   };

//   // 取出任务并推送到执行器;
//   const runTask = () => {
//     const task = promises.shift();
//     task && runner(task);
//   };

//   // 执行器
//   // 执行任务，同时更新当前并发数
//   const runner = async (task) => {
//     try {
//       concurrentCount++;
//       await task();
//     } catch (error) {
//     } finally {
//       // 并发数--
//       concurrentCount--;
//       picker();
//     }
//   };

//   // 捞起下一个任务
//   const picker = () => {
//     // 任务队列里还有任务并且此时还有剩余并发数的时候，执行
//     if (concurrentCount < limits && promises.length > 0) {
//       // 继续执行任务
//       runTask();
//       // 队列为空的时候，并且请求池清空了，就可以执行最后的回调函数了
//     } else if (promises.length === 0 && concurrentCount === 0)
//       // 执行结束
//       callback && callback();
//   };

//   // 开始执行
//   runTaskNeeded();
// };

// type PromiseFunc = () => Promise<unknown>;

// const createRequestPool = (limit: number) => {
//     const queue: PromiseFunc[] = [];

//     const runningQueue: Set<PromiseFunc> = new Set();

//     const run = () => {
//         if (runningQueue.size >= limit) return;

//         const wantage = limit - runningQueue.size;

//         queue.splice(0, wantage).forEach(func => {
//             runningQueue.add(func);
//             func().then(() => {
//                 runningQueue.delete(func);
//                 run();
//             })
//         })
//     }
//     return (request: PromiseFunc) => {
//         return new Promise (res => {
//             queue.push(() => request().then(result => {
//                 res(result)
//                 return result
//             }))
//             run();
//         })
//     }
// }

// const limitLoad = (urls, handler, limit) => {
//     const sequence = [...urls];
//     // 正在执行的请求
//     let promise = sequence.splice(0, limit).map((url, index) => {
//         return handler(url).then(() => {
//             return index;
//         })
//     })

//     // 最先执行完成的请求
//     let p = Promise.race(promise);

//     sequence.forEach((item, index) => {
//         p = p.then(res => {
//             // console.log('p: res', res);
//             promise[res] = handler(sequence[index]).then(() => res);
//             return Promise.race(promise)
//         })
//     })

//     console.log('promise', promise);
// }

// const urls =[
//     {info:'1', time:2000},
//     {info:'2', time:1000},
//     {info:'3', time:2000},
//     {info:'4', time:2000},
//     {info:'5', time:3000},
//     {info:'6', time:1000},
//     {info:'7', time:2000},
//     {info:'8', time:2000},
//     {info:'9', time:3000},
//     {info:'10', time:1000}
// ]

// function loadImg(url){
//     return new Promise((resolve, reject)=>{
//         console.log(url.info + '---start')
//         setTimeout(()=>{
//             console.log(url.info, 'ok!!!')
//             resolve();
//         }, url.time)
//     })
// }

// limitLoad(urls, loadImg, 3)

// //自定义请求函数
// var request = url => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(`任务${url}完成`)
//         }, 1000)
//     }).then(res => {
//         console.log('外部逻辑', res);
//     })
// }

// //添加任务
// function addTask(url){
//     let task = request(url);
//     pool.push(task);
//     task.then(res => {
//         //请求结束后将该Promise任务从并发池中移除
//         pool.splice(pool.indexOf(task), 1);
//         console.log(`${url} 结束，当前并发数：${pool.length}`);
//         url = urls.shift();
//         // //每当并发池跑完一个任务，就再塞入一个任务
//         if(url !== undefined){
//             addTask(url);
//         }
//     })
// }

// let urls =  ['bytedance.com','tencent.com','alibaba.com','microsoft.com','apple.com','hulu.com','amazon.com'] // 请求地址
// let pool = []//并发池
// let max = 3 //最大并发量
// //先循环把并发池塞满
// while (pool.length < max) {
//     let url = urls.shift();
//     addTask(url)
// }

// const pLimit = (concurrency) => {
//   const queue = [];
//   let activeCount = 0;

//   const next = () => {
//     activeCount--;

//     if (queue.length > 0) {
//       queue.shift()();
//     }
//   };

//   const run = async (fn, resolve, ...args) => {
//     activeCount++;

//     const result = (async () => fn(...args))();

//     resolve(result);

//     try {
//       await result;
//     } catch {}

//     next();
//   };

//   // 异步任务入队
//   const enqueue = (fn, resolve, ...args) => {
//     queue.push(run.bind(null, fn, resolve, ...args));

//     if (activeCount < concurrency && queue.length > 0) {
//       queue.shift()();
//     }
//   };

//   // 添加并发任务的函数
//   const generator = (fn, ...args) =>
//     new Promise((resolve) => {
//       enqueue(fn, resolve, ...args);
//     });

//   return generator;
// };

// const limit = pLimit(2);

// function asyncFun(value, delay) {
//   return new Promise((resolve) => {
//     console.log("start " + value);
//     setTimeout(() => resolve(value), delay);
//   });
// }

// (async function () {
//   const arr = [
//     limit(() => asyncFun("aaa", 2000)),
//     limit(() => asyncFun("bbb", 3000)),
//     limit(() => asyncFun("ccc", 1000)),
//     limit(() => asyncFun("ccc", 1000)),
//     limit(() => asyncFun("ccc", 1000)),
//   ];

//   const result = await Promise.all(arr);
//   console.log(result);
// })();

// *****************************
// 并发请求不使用promise api
// const limitRequest = (urls, maxNum) => {
//   const results = [];
//   let index = 0; // 下一个请求的下标
//   let count = 0; // 当前请求完成的数量
//   return new Promise((resolve) => {
//     if (urls.length === 0) {
//       resolve([]);
//       return;
//     }

//     const request = async () => {
//       if (index === urls.length) return;
//       const i = index; // 保存序号，使result和urls相对应
//       const url = urls[index];
//       index++;

//       try {
//         const resp = await fetch(url);
//         results[i] = resp;
//       } catch (error) {
//         results[i] = error;
//       } finally {
//         count++;
//         if (count === urls.length) {
//           // 全部请求并发完成
//           resolve(results);
//         }
//         request();
//       }
//     };

//     const times = Math.min(maxNum, urls.length);
//     for (let i = 0; i < times; i++) {
//       request();
//     }
//   });
// };

// // 测试
// const urls = [];
// for (let i = 1; i < 20; i++) {
//   urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
// }

// limitRequest(urls, 3).then((res) => {
//   console.log(res);
// });

const req = (val, time) => () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log(`${val}结束了`);
      res(val);
    }, time * 1000);
  });
};

const reqArr = [req(1, 4), req(2, 1), req(3, 4), req(4, 7), req(5, 1)];

const limitReq = (limit, arr) => {
  const result = [];
  let index = 0;
  let count = 0;
  return new Promise((resolve, reject) => {
    const run = async () => {
      if (index === arr.length) {
        return;
      }
      const req = arr[index];
      index++;
      try {
        const resp = await req();
        // 等待请求执行完，才index自增，错误的
        // const resp = await arr[index]()
        // index++;
        result.push(resp);
      } catch (error) {
        result.push(error);
      } finally {
        count++;
        if (count === arr.length) {
          resolve(result);
        }
        run();
      }
    };

    const minLength = Math.min(limit, arr.length);

    for (let i = 0; i < minLength; i++) {
      run();
    }
  });
};

limitReq(2, reqArr).then((res) => console.log(res));

