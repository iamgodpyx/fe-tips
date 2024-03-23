//计算乘积除以当前项
//传参 [1,2,3,4]
//输出 [24,12,8,6]

const func = (arr) => {
    let sum = 1; 
    arr.forEach(item => {
        sum *= item;
    });

    return arr.map (item => sum / item);
}

const a = func([1,2,3,4]);

console.log(a);