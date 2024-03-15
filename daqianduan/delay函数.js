// 1. 

// function delay(time) {
//     return {
//         then: function(cb) {
//             setTimeout(()=>{
//                 cb()
//             },time)
//         }
//     }
// }

// delay(3000).then(() => {console.log(123)})

// 2.
function delay(time){
    return new Promise((res, rej) => {
        setTimeout(res, time)
    }) 
}


delay(3000).then(()=>console.log(123))