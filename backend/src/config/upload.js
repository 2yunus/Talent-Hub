const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/avatars',
  'uploads/resumes',
  'uploads/logos',
  'uploads/temp'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    logo: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  const uploadType = req.params.type || req.body.type || 'temp';
  const allowed = allowedTypes[uploadType] || [...allowedTypes.avatar, ...allowedTypes.resume];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${uploadType}: ${allowed.join(', ')}`), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.params.type || req.body.type || 'temp';
    let uploadPath = 'uploads/temp';

    switch (uploadType) {
      case 'avatar':
        uploadPath = 'uploads/avatars';
        break;
      case 'resume':
        uploadPath = 'uploads/resumes';
        break;
      case 'logo':
        uploadPath = 'uploads/logos';
        break;
      default:
        uploadPath = 'uploads/temp';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const userId = req.user?.userId || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${userId}_${timestamp}_${baseName}${ext}`;
    cb(null, filename);
  }
});

// File size limits (in bytes)
const limits = {
  avatar: 5 * 1024 * 1024,    // 5MB for avatars
  logo: 5 * 1024 * 1024,      // 5MB for logos
  resume: 10 * 1024 * 1024,   // 10MB for resumes
  default: 5 * 1024 * 1024    // 5MB default
};

// Create multer instances for different upload types
const createUploadMiddleware = (type) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: limits[type] || limits.default,
      files: 1 // Only allow one file at a time
    }
  }).single('file');
};

// Upload middleware for different types
const uploadAvatar = createUploadMiddleware('avatar');
const uploadResume = createUploadMiddleware('resume');
const uploadLogo = createUploadMiddleware('logo');

// Generic upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1
  }
}).single('file');

// Utility functions
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getFileUrl = (filename, type = 'temp') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${type}/${filename}`;
};

const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.mimetype);
};

// Clean up old temporary files (run periodically)
const cleanupTempFiles = () => {
  const tempDir = path.join(__dirname, '../../uploads/temp');
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  fs.readdir(tempDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        const now = Date.now();
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > maxAge) {
          deleteFile(filePath).catch(console.error);
        }
      });
    });
  });
};

// Run cleanup every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

module.exports = {
  upload,
  uploadAvatar,
  uploadResume,
  uploadLogo,
  createUploadMiddleware,
  deleteFile,
  getFileUrl,
  validateFileSize,
  validateFileType,
  cleanupTempFiles,
  limits
};
