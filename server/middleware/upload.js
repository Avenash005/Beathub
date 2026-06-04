const multer = require('multer');
const path = require('path');

// Configure memory storage - keeps file in RAM as Buffer
const storage = multer.memoryStorage();

// File size limit: 5MB
const fileSizeLimit = 5 * 1024 * 1024;

// File filter - only allow image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'), false);
  }
};

// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSizeLimit
  },
  fileFilter: fileFilter
});

module.exports = upload;
