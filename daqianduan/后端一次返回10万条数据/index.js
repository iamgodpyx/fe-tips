const getList = () => {
    return new Promise((resolve, reject) => {

        var ajax = new XMLHttpRequest();
        ajax.open('get', 'http://127.0.0.1:8000');
        ajax.send();
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4 && ajax.status === 200) {
                resolve(JSON.parse(ajax.responseText))
            }
        }
    })
}

const container = document.getElementById('container')

// 直接加载
// const renderList = async () => {
//     const list = await getList()

//     list.forEach(item => {
//         const div = document.createElement('div');
//         div.className = 'sunshine';
//         div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
//         container.appendChild(div)
//     })
// }

// 使用setTimeout
// const renderList = async () => {

//     const list = await getList()

//     const total = list.length
//     const page = 0
//     const limit = 200
//     const totalPage = Math.ceil(total / limit)

//     const render = (page) => {
//         if (page >= totalPage) return
//         setTimeout(() => {
//             for (let i = page * limit; i < page * limit + limit; i++) {
//                 const item = list[i]
//                 const div = document.createElement('div')
//                 div.className = 'sunshine'
//                 div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
//                 container.appendChild(div)
//             }
//             render(page + 1)
//         }, 0)
//     }
//     render(page)
// }

// 使用requestAnimationFrame
// const renderList = async () => {
//     const list = await getList()

//     const total = list.length
//     const page = 0
//     const limit = 200
//     const totalPage = Math.ceil(total / limit)

//     const render = (page) => {
//         if (page >= totalPage) return

//         requestAnimationFrame(() => {
//             for (let i = page * limit; i < page * limit + limit; i++) {
//                 const item = list[i]
//                 const div = document.createElement('div')
//                 div.className = 'sunshine'
//                 div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
//                 container.appendChild(div)
//             }
//             render(page + 1)
//         })
//     }
//     render(page)
// }

// 创建文档片段+requestAnimationFrame
const renderList = async () => {
    console.time('time')
    const list = await getList()
    console.log(list)
    const total = list.length
    const page = 0
    const limit = 200
    const totalPage = Math.ceil(total / limit)

    const render = (page) => {
        if (page >= totalPage) return
        requestAnimationFrame(() => {

            const fragment = document.createDocumentFragment()
            for (let i = page * limit; i < page * limit + limit; i++) {
                const item = list[i]
                const div = document.createElement('div')
                div.className = 'sunshine'
                div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`

                fragment.appendChild(div)
            }
            container.appendChild(fragment)
            render(page + 1)
        })
    }
    render(page)
    console.timeEnd('time')
}

renderList()