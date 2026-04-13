// src/controllers/folderController.js
const Folder = require('../models/Folder');
const fs = require('fs');
const path = require('path');
const File = require('../models/File');



exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    let parentPath = 'storage/root';
    let parent = null;

    if (parentFolder) {
      parent = await Folder.findById(parentFolder);
      if (!parent) {
        return res.status(404).json({ error: 'Parent folder not found' });
      }
      parentPath = parent.path;
    }

    const newPath = path.join(parentPath, name);

    // create on disk
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true });
    }

    // save in DB
    const folder = await Folder.create({
      name,
      parentFolder: parent ? parent._id : null,
      path: newPath
    });

    res.status(201).json(folder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const mongoose = require('mongoose');

exports.getFolderContents = async (req, res) => {
  try {
    const { folderId } = req.params;

    let query = { parentFolder: null };
    if (folderId && folderId !== 'null' && folderId !== 'root') {
      query = { parentFolder: new mongoose.Types.ObjectId(folderId) };
    }

    const folders = await Folder.find(query);
    const files = await File.find(query);

    res.json({
      folders,
      files
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    async function deleteRecursive(folderId) {

      // delete files in this folder
      const files = await File.find({ parentFolder: folderId });

      for (const file of files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        await File.findByIdAndDelete(file._id);
      }

      // delete subfolders
      const subfolders = await Folder.find({ parentFolder: folderId });

      for (const sub of subfolders) {
        await deleteRecursive(sub._id);
      }

      // delete folder itself
      const folder = await Folder.findById(folderId);

      if (folder && fs.existsSync(folder.path)) {
        fs.rmdirSync(folder.path, { recursive: true });
      }

      await Folder.findByIdAndDelete(folderId);
    }

    await deleteRecursive(folderId);

    res.json({ message: 'Folder deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};