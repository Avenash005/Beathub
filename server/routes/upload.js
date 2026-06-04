const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'creator-platform',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// POST /api/upload - Upload an image file
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  try {
    // Upload the file buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    
    // Return the secure URL and public ID
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Multer error handling middleware (4 parameters for error handler)
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    // Multer errors (file too large, etc.)
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  } else if (error) {
    // Other errors (file type not allowed)
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
});

module.exports = router;
