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
      setProgress(0); // EXPLICIT RESET
      setError(null);

      const filesArray = Array.from(files);
      const downloadURLs = [];
      const errors = [];

      // SEQUENTIAL UPLOAD - Replace Promise.all with for loop
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];

        try {
          validateImageFile(file);
          const compressedFile = await compressImage(file);
          const path = generateImagePath(folder, file.name);

          const downloadURL = await uploadImage(
            compressedFile,
            path,
            (fileProgressValue) => {
              // Calculate overall: completed files + current file contribution
              const completedFiles = i;
              const currentFileContribution = fileProgressValue / 100;
              const overallProgress =
                ((completedFiles + currentFileContribution) / filesArray.length) * 100;
              setProgress(overallProgress);
            }
          );

          downloadURLs.push(downloadURL);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          errors.push({ file: file.name, error: err.message });
        }
      }

      // Handle partial failures
      if (errors.length > 0) {
        const errorMessage = errors.length === filesArray.length
          ? `All uploads failed: ${errors[0].error}`
          : `${errors.length} of ${filesArray.length} uploads failed`;
        setError(errorMessage);

        if (downloadURLs.length === 0) {
          throw new Error(errorMessage);
        }
      }

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
