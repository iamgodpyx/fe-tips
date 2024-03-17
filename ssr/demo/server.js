// server.js
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 路由处理
app.get('/', (req, res) => {
  // 渲染视图模板，并将数据传递给模板
  res.render('index', { title: 'SSR Example', message: 'Hello, SSR!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const a = path.resolve(__dirname, './views/index.ejs');
// console.log(123123, a);

// console.log(111, JSON.stringify(require(a)));