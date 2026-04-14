const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

// Mảng giả lập cơ sở dữ liệu
let database = [];

// API lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    res.json(database);
});

// API Admin niêm yết sản phẩm mới
app.post('/api/admin/add', (req, res) => {
    const newProduct = req.body;
    database.push(newProduct);
    res.status(200).send("Đã lưu sản phẩm!");
});

app.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});
