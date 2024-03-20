const foo = (time) => {
    console.log(time);
    window.requestAnimationFrame(foo)

}

window.requestAnimationFrame(foo)