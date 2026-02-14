import { useState } from 'react';
import { uploadImage, generateImagePath } from '../lib/storage';
import { compressImage, validateImageFile } from '../utils/imageCompression';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadSingleImage = async (file, folder) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Validate file
      validateImageFile(file);

      // Compress image
      const compressedFile = await compressImage(file);

      // Generate unique path
      const path = generateImagePath(folder, file.name);

      // Upload to Firebase Storage
      const downloadURL = await uploadImage(
        compressedFile,
        path,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      return downloadURL;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleImages = async (files, folder) => {
    try {
      setUploading(true);
      setError(null);

      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Validate file
        validateImageFile(file);

        // Compress image
        const compressedFile = await compressImage(file);

        // Generate unique path
        const path = generateImagePath(folder, file.name);

        // Upload to Firebase Storage
        const downloadURL = await uploadImage(
          compressedFile,
          path,
          (progressValue) => {
            // Calculate overall progress
            const overallProgress = ((index + progressValue / 100) / files.length) * 100;
            setProgress(overallProgress);
          }
        );

        return downloadURL;
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const resetUpload = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadSingleImage,
    uploadMultipleImages,
    uploading,
    progress,
    error,
    resetUpload,
  };
};
