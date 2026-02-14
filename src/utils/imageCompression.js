import Compressor from 'compressorjs';

// Compress image before upload
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: options.quality || 0.8,
      maxWidth: options.maxWidth || 1920,
      maxHeight: options.maxHeight || 1080,
      mimeType: 'image/jpeg',
      convertSize: 1000000, // Convert to JPEG if > 1MB
      success: (result) => {
        resolve(result);
      },
      error: (err) => {
        console.error('Compression error:', err);
        reject(err);
      },
    });
  });
};

// Validate image file
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB');
  }

  return true;
};

// Convert blob URL to file
export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type });
};

// Get image from clipboard
export const getImageFromClipboard = async (clipboardData) => {
  const items = clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      return blob;
    }
  }

  return null;
};
