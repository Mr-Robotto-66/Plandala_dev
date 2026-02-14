import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured, getFirebaseError } from './firebase';

// Helper to get user-friendly error messages
const getStorageErrorMessage = (error) => {
  if (!isFirebaseConfigured) {
    return `Firebase Storage not configured: ${getFirebaseError()}`;
  }

  switch (error.code) {
    case 'storage/unauthorized':
    case 'storage/permission-denied':
      return 'Permission denied. Firebase Storage security rules may need to be configured.';
    case 'storage/canceled':
      return 'Upload was canceled.';
    case 'storage/retry-limit-exceeded':
      return 'Upload failed after multiple retries. Please check your internet connection.';
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded.';
    default:
      return error.message || 'Upload failed. Please try again.';
  }
};

// Upload image to Firebase Storage
export const uploadImage = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    // Check Firebase initialization
    if (!isFirebaseConfigured || !storage) {
      reject(new Error(getStorageErrorMessage({ code: 'storage/not-configured' })));
      return;
    }

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Timeout detection (30 seconds with no progress)
    let lastProgressTime = Date.now();
    const TIMEOUT_MS = 30000;

    const timeoutCheck = setInterval(() => {
      if (Date.now() - lastProgressTime > TIMEOUT_MS) {
        clearInterval(timeoutCheck);
        uploadTask.cancel();
        reject(new Error('Upload timeout - no progress for 30 seconds'));
      }
    }, 5000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        lastProgressTime = Date.now(); // Update last progress time

        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        clearInterval(timeoutCheck);
        const errorMessage = getStorageErrorMessage(error);
        console.error('Upload error:', error);
        reject(new Error(errorMessage));
      },
      async () => {
        clearInterval(timeoutCheck);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(new Error(getStorageErrorMessage(error)));
        }
      }
    );
  });
};

// Delete image from Firebase Storage
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Generate unique filename
export const generateImagePath = (folder, filename) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);
  const extension = filename.split('.').pop();
  return `${folder}/IMG_${timestamp}_${randomId}.${extension}`;
};
