const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// 1. Cấu hình nơi lưu trữ ảnh (Storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Ảnh sẽ lưu vào thư mục này
    },
    filename: function (req, file, cb) {
        // Đặt tên file: Thời_gian_hiện_tại + tên gốc để tránh trùng
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// 2. API Niêm yết sản phẩm (Có kèm upload 1 ảnh - 'pImage')
app.post('/api/admin/add-product', upload.single('pImage'), (req, res) => {
    const { pName, pPrice } = req.body;
    const pImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (!pImage) {
        return res.status(400).send("Vui lòng chọn ảnh sản phẩm.");
    }

    const newProduct = {
        name: pName,
        price: pPrice,
        image: pImage
    };

    console.log("Đã niêm yết:", newProduct);
    // Tại đây bạn có thể lưu newProduct vào Database (MongoDB/SQL)
    res.json({ message: "Niêm yết sản phẩm thành công!", data: newProduct });
});

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
