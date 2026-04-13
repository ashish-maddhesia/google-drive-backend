const mongoose = require('mongoose');

exports.validateCreateFolder = (req, res, next) => {
  const { name, parentFolder } = req.body;

  // name required
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  // name length
  if (name.length > 50) {
    return res.status(400).json({ error: 'Folder name too long' });
  }

  // validate parentFolder if exists
  if (parentFolder && !mongoose.Types.ObjectId.isValid(parentFolder)) {
    return res.status(400).json({ error: 'Invalid parent folder ID' });
  }

  next();
};