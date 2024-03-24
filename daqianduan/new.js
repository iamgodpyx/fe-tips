// /**
//  * @param {string} num1
//  * @param {string} num2
//  * @return {string}
//  */
// var addStrings = function(num1, num2) {
//     const arr1 = num1.length >= num2.length ? num1.split('') : num2.split('');
//     const arr2 = num1.length >= num2.length ? num2.split('') : num1.split('');
//     const result = [];
//     let _temp = 0;

//     let time = arr2.length - 1;

//     for (let i = arr1.length -1; i >=0; i--) {

//         if (time >= 0) {
            
//             let count = Number(arr1[i]) + Number(arr2[time]) + _temp;

//             if (count > 9) {
//                 result.push(String(count)[1]);
//                 _temp = 1;
//             } else {
//                 result.push(String(count))
//             }

//             time--;
            

//         } else {
//             let count = Number(arr1[i]) + _temp;
//              if (count > 9) {
//                 result.push(String(count)[1]);
//                 _temp = 1;
//             } else {
//                 result.push(String(count))
//             }
//         }
//     }

//     return result.join('');
// };

// addStrings('11', '123')


// function create(con, ...args) {
//     let obj = {};
//     Object.setPrototypeOf(obj, con.prototype);
//     let result = con.apply(obj, args);
//     return result instanceof Object ? result : obj
// }

function myNew(Fn, ...args) {
    let obj = Object.create(Fn.prototype)

    let result = Fn.apply(obj, args);

    return result instanceof Object ? result : obj;
}

function Test(name, age) {
    this.name = name
    this.age = age
  }
  Test.prototype.sayName = function () {
      console.log(this.name)
  }
  const a = myNew(Test, 'yck', 26)
  console.log(a.name) // 'yck'
  console.log(a.age) // 26
  a.sayName() // 'yck'
