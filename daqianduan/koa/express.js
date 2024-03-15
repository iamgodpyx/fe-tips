const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(12412, () => {
    console.log('server started on port 12412');
})