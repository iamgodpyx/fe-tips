// 失败重试，200ms 试一次，500ms 试一次。还不成功就返回失败

const request = (url) => {
  let retryCount = 1;
  return new Promise((res, rej) => {
    const fetchReq = () =>
      fetch(url)
        .then((resp) => {
          if (resp.ok) {
            res(resp.json());
          }
        })
        .catch((error) => {
          if (retryCount <= 2) {
            retryCount++;
            const time = retryCount === 1 ? 200 : 500;
            setTimeout(() => {
              fetchReq();
            }, time);
          } else {
            rej(error);
          }
        });

    fetchReq();
  });
};

const url =
  "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc&_signature=_02B4Z6wo00101wALJiAAAIDAPaI8vz.IIK8ALyKAAKYGrCcfVZcPmn332d9AbU7uNgcIekrd6PZzsJAyaDabxFDsMZ9.fmMMk3PH3iX8CBC.ebxlPGMe5Hl9tzHHFNZ1cWD2GMUSrc0TTqn.18";

request(url)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
