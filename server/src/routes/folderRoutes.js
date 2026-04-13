const express = require('express');
const router = express.Router();

// controllers
const {
  createFolder,
  getFolderContents,
  deleteFolder
} = require('../controllers/folderController');

// validators
const {
  validateCreateFolder
} = require('../validators/folderValidator');

// 📁 Create folder
router.post('/create', validateCreateFolder, createFolder);

// 📥 Get folder contents
router.get('/:folderId', getFolderContents);

// ❌ Delete folder
router.delete('/:folderId', deleteFolder);

module.exports = router;