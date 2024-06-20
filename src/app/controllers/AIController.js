const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục để lưu file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file
  }
});

// Khởi tạo Multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

const chanDoan = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ errcode: 1, message: 'No file uploaded' });
    }

    // Xử lý file image tại đây (chuyển đổi, chẩn đoán, v.v.)
    console.log('Image received:', image);

    // Trả về kết quả chẩn đoán
    res.json({ errcode: 0, message: 'Chẩn đoán thành công', prediction: ['Kết quả giả định'] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errcode: 1, message: 'Internal Server Error' });
  }
};

module.exports = {
  chanDoan,
  upload, // Xuất export middleware upload để sử dụng trong router
};
