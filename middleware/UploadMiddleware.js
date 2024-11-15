// middleware/UploadMiddleware.js
const multer = require('multer');

// Konfigurasi multer untuk penyimpanan file sementara
const storage = multer.memoryStorage(); // Gunakan memoryStorage jika ingin langsung mengupload ke ImageKit

const upload = multer({ storage: storage });

upload.single('coverImage');  // Memastikan kita menggunakan nama field yang tepat

module.exports = upload;
