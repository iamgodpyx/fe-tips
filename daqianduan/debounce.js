
const debounce = (func, time) => {
    let temp;
    return function (...args) {
        clearTimeout(temp)
        temp = setTimeout(() => {
            func.apply(this, args)
        }, time)
    }
}

const throttle = (func, time) => {
    let temp = Date.now();

    return function(...args) {
        let cur = Date.now();
        if (cur - temp >= time) {
            func.apply(this, args);
        }
        time = Date.now();
    }

}
