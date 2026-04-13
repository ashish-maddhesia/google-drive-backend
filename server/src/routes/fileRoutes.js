const express = require('express');
const router = express.Router();

const upload = require('../middleware/multerMiddleware');

const {
  uploadFile,
  getFiles,
  deleteFile
} = require('../controllers/fileController');

const {
  validateFileUpload
} = require('../validators/fileValidator');

// 📤 Upload file
router.post('/upload', upload.single('file'), validateFileUpload, uploadFile);

// 📥 Get files in folder
router.get('/:folderId', getFiles);

// ❌ Delete file
router.delete('/:fileId', deleteFile);

module.exports = router;