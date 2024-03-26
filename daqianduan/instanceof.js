function myInstanceof(obj, Fn) {
    let __proto__ = obj.__proto__;

    while (__proto__) {
        if (__proto__ === Fn.prototype){
            return true;
        }
        __proto__ = __proto__.__proto__
    }
   return false;
}

const A = function() {};

let a = new A()
let b = 1;

console.log(myInstanceof(b, A));