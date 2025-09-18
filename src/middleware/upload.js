// Middleware de subida de archivos (mock para test y desarrollo)
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;