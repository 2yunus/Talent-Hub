const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { deleteFile, getFileUrl, validateFileSize, validateFileType } = require('../config/upload');

const prisma = new PrismaClient();

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select an avatar image to upload'
      });
    }

    const userId = req.user.userId;
    const file = req.file;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validateFileType(file, allowedTypes)) {
      // Delete uploaded file
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only JPEG, PNG, GIF, and WebP images are allowed for avatars'
      });
    }

    if (!validateFileSize(file, 5 * 1024 * 1024)) { // 5MB
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'File too large',
        message: 'Avatar images must be smaller than 5MB'
      });
    }

    // Get current user to check for existing avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });

    // Delete old avatar if exists
    if (user?.avatar) {
      const oldAvatarPath = user.avatar.replace(process.env.BASE_URL || 'http://localhost:5000', '');
      const fullOldPath = path.join(__dirname, '../../', oldAvatarPath);
      await deleteFile(fullOldPath).catch(() => {}); // Ignore errors
    }

    // Generate file URL
    const avatarUrl = getFileUrl(file.filename, 'avatars');

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true
      }
    });

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      user: updatedUser,
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: avatarUrl
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await deleteFile(req.file.path).catch(() => {});
    }
    
    console.error('Upload avatar error:', error);
    res.status(500).json({
      error: 'Internal server error while uploading avatar'
    });
  }
};

// Upload company logo
const uploadLogo = async (req, res) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      if (req.file) await deleteFile(req.file.path).catch(() => {});
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only employers can upload company logos'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a logo image to upload'
      });
    }

    const userId = req.user.userId;
    const file = req.file;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validateFileType(file, allowedTypes)) {
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only JPEG, PNG, GIF, WebP, and SVG images are allowed for logos'
      });
    }

    if (!validateFileSize(file, 5 * 1024 * 1024)) { // 5MB
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'File too large',
        message: 'Logo images must be smaller than 5MB'
      });
    }

    // Get or create company
    let company = await prisma.company.findUnique({
      where: { ownerId: userId }
    });

    // Delete old logo if exists
    if (company?.logo) {
      const oldLogoPath = company.logo.replace(process.env.BASE_URL || 'http://localhost:5000', '');
      const fullOldPath = path.join(__dirname, '../../', oldLogoPath);
      await deleteFile(fullOldPath).catch(() => {}); // Ignore errors
    }

    // Generate file URL
    const logoUrl = getFileUrl(file.filename, 'logos');

    if (company) {
      // Update existing company
      company = await prisma.company.update({
        where: { id: company.id },
        data: { logo: logoUrl }
      });
    } else {
      // Create new company
      company = await prisma.company.create({
        data: {
          name: 'My Company',
          logo: logoUrl,
          ownerId: userId
        }
      });
    }

    res.status(200).json({
      message: 'Company logo uploaded successfully',
      company: {
        id: company.id,
        name: company.name,
        logo: company.logo
      },
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: logoUrl
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await deleteFile(req.file.path).catch(() => {});
    }
    
    console.error('Upload logo error:', error);
    res.status(500).json({
      error: 'Internal server error while uploading logo'
    });
  }
};

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (req.user.role !== 'DEVELOPER') {
      if (req.file) await deleteFile(req.file.path).catch(() => {});
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only developers can upload resumes'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a resume file to upload'
      });
    }

    const file = req.file;

    // Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validateFileType(file, allowedTypes)) {
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only PDF, DOC, and DOCX files are allowed for resumes'
      });
    }

    if (!validateFileSize(file, 10 * 1024 * 1024)) { // 10MB
      await deleteFile(file.path);
      return res.status(400).json({
        error: 'File too large',
        message: 'Resume files must be smaller than 10MB'
      });
    }

    // Generate file URL
    const resumeUrl = getFileUrl(file.filename, 'resumes');

    res.status(200).json({
      message: 'Resume uploaded successfully',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: resumeUrl,
        type: file.mimetype
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await deleteFile(req.file.path).catch(() => {});
    }
    
    console.error('Upload resume error:', error);
    res.status(500).json({
      error: 'Internal server error while uploading resume'
    });
  }
};

// Delete file
const deleteUploadedFile = async (req, res) => {
  try {
    const { filename, type } = req.params;
    const userId = req.user.userId;

    if (!filename || !type) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Filename and type are required'
      });
    }

    // Validate file type
    const allowedTypes = ['avatars', 'logos', 'resumes'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Invalid file type specified'
      });
    }

    // Check if user owns the file (basic security check)
    if (!filename.startsWith(userId)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own files'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Delete the file
    await deleteFile(filePath);

    // Update database if it's an avatar or logo
    if (type === 'avatars') {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null }
      });
    } else if (type === 'logos') {
      await prisma.company.updateMany({
        where: { ownerId: userId },
        data: { logo: null }
      });
    }

    res.status(200).json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting file'
    });
  }
};

// Get file info
const getFileInfo = async (req, res) => {
  try {
    const { filename, type } = req.params;

    if (!filename || !type) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Filename and type are required'
      });
    }

    const allowedTypes = ['avatars', 'logos', 'resumes'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Invalid file type specified'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileUrl = getFileUrl(filename, type);

    res.status(200).json({
      file: {
        filename,
        type,
        size: stats.size,
        url: fileUrl,
        uploadedAt: stats.birthtime,
        lastModified: stats.mtime
      }
    });

  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      error: 'Internal server error while getting file info'
    });
  }
};

// List user files
const listUserFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type } = req.query;

    const allowedTypes = ['avatars', 'logos', 'resumes'];
    const typesToCheck = type ? [type] : allowedTypes;

    const userFiles = [];

    for (const fileType of typesToCheck) {
      const uploadDir = path.join(__dirname, '../../uploads', fileType);
      
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        const userTypeFiles = files
          .filter(filename => filename.startsWith(userId))
          .map(filename => {
            const filePath = path.join(uploadDir, filename);
            const stats = fs.statSync(filePath);
            return {
              filename,
              type: fileType,
              size: stats.size,
              url: getFileUrl(filename, fileType),
              uploadedAt: stats.birthtime,
              lastModified: stats.mtime
            };
          });
        
        userFiles.push(...userTypeFiles);
      }
    }

    // Sort by upload date (newest first)
    userFiles.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.status(200).json({
      files: userFiles,
      count: userFiles.length
    });

  } catch (error) {
    console.error('List user files error:', error);
    res.status(500).json({
      error: 'Internal server error while listing files'
    });
  }
};

module.exports = {
  uploadAvatar,
  uploadLogo,
  uploadResume,
  deleteUploadedFile,
  getFileInfo,
  listUserFiles
};
