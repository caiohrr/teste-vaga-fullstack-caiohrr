const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp-uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, file.fieldname + '-' + suffix);
  }
})

const upload = multer({storage: storage});

module.exports = upload;
