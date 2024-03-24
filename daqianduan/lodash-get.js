//lodash的get方法
function get(object, path, defaultValue = 'undefined') {
    //构造数组,将'['和']'替换成'.'
    let newPath = [];
    newPath = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');

    return newPath.reduce((a, b) => {
        return (a || {})[b]
    }, object) || defaultValue
}

//测试
const obj = {
    a: {
        b: [{
            c: 1
        }]
    }
}

console.log(get(obj, 'a.b[0].c[1].e[2][1].e', 0));


console.log(get(obj, 'a.b[0].c', 0));


console.log(get(obj, 'a.b.c', 0));


console.log(get(obj, 'a', 0));


