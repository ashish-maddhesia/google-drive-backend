const File = require('../models/File');
const Folder = require('../models/Folder');

exports.uploadFile = async (req, res) => {
  try {
    const { parentFolder } = req.body;

    let folderPath = 'storage/root';

    // find folder if provided
    if (parentFolder) {
      const folder = await Folder.findById(parentFolder);
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
      folderPath = folder.path;
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File missing' });
    }

    // save in DB
    const file = await File.create({
      name: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      parentFolder: parentFolder || null
    });

    res.status(201).json(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getFiles = async (req, res) => {
  try {
    const { folderId } = req.params;

    const files = await File.find({ parentFolder: folderId });

    res.json(files);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // delete from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // delete from DB
    await File.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};