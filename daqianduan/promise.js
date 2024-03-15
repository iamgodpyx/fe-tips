const promise1 = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
    //   res(1);
        // return 1;
    }, 1000);
    //  res(1);
  }).then((res) => {
    return 1
  });
};

const promise2 = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
    //   res(2);
      //   return 1;
    }, 2000);
    //  res(1);
  }).then((res) => {
    return 2;
  });
};

const promise3 = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(3);
      //   return 1;
    }, 3000);
    //  res(1);
  }).then((res) => {
    // Promise.resolve(123)
    // return 3;
    // new Promise((res, rej) => {
    //     res(123)
    // })
    return 3
  });
};

let p = Promise.race([promise1(), promise2(), promise3()]);

// promise1().then((res) => console.log(res));
// p.then((res) => console.log("resresresres", res)).then((res) =>
//   console.log("resresresres123123", res)
// );
// p.then((res) => console.log("resresresres", res));

promise3().then(res => console.log(res))