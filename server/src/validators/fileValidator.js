exports.validateFileUpload = (req, res, next) => {

  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (req.file.size > MAX_SIZE) {
    return res.status(400).json({ error: 'File too large' });
  }

  next();
};  