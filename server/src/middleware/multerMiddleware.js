const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    try {
      const folderPath = req.body.path || 'storage/root';

      // create folder if not exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }

});

const upload = multer({ storage });

module.exports = upload;