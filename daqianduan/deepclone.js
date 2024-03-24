const deepClone = (obj, hash = new WeakMap()) => {
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);

    if (typeof obj !== 'object' || obj === null) return obj;

    if (hash.has(obj)) return hash.get(obj);

    let t = obj.constructor();

    hash.set(obj, t);

    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            t[i] = deepClone(obj[i], hash)
        }
    }

    return t;
}

  //测试
  let a = {
    a: 'hello',
    b: {
        a: 'ee',
        b: [1, 3, function () { return 123 }]
    },
    c: 'wer',
    d: [4, 3, 5, 6, 3]
}

let b = deepClone(a)
b.b.b[1] = 5;
b['b']['b'][2] = () => {
    return 789
}

console.log(a.b.b[2]());
console.log(b);
console.log(a);

