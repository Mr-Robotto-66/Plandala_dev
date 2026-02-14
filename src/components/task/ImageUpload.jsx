import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../../hooks/useImageUpload';
import { getImageFromClipboard } from '../../utils/imageCompression';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ImageUpload = ({
  onImagesUploaded,
  onImageRemoved,
  existingImages = [],
  folder = 'task-images'
}) => {
  const { uploadMultipleImages, uploading, progress, error } = useImageUpload();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [removedExistingImages, setRemovedExistingImages] = useState([]);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    // Create preview URLs
    const previews = acceptedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(previews);

    try {
      // Upload files
      const urls = await uploadMultipleImages(acceptedFiles, folder);
      setUploadedUrls((prev) => [...prev, ...urls]);

      if (onImagesUploaded) {
        onImagesUploaded(urls);
      }

      // Clear previews after upload
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (err) {
      console.error('Upload failed:', err);
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    }
  }, [uploadMultipleImages, folder, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
    disabled: uploading,
  });

  // Handle paste event
  useEffect(() => {
    const handlePaste = async (e) => {
      const image = await getImageFromClipboard(e.clipboardData);
      if (image) {
        e.preventDefault();
        onDrop([image]);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onDrop]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const removeUploadedImage = (index) => {
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setRemovedExistingImages((prev) => [...prev, url]);
    if (onImageRemoved) {
      onImageRemoved(url);
    }
  };

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-plandala-cyan-400 bg-plandala-cyan-400/10'
            : 'border-plandala-border hover:border-plandala-cyan-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload
            size={32}
            className={isDragActive ? 'text-plandala-cyan-400' : 'text-plandala-muted'}
          />
          <div className="text-sm text-plandala-muted">
            {isDragActive ? (
              <p>Drop images here...</p>
            ) : (
              <>
                <p>Drag & drop images, or click to select</p>
                <p className="text-xs mt-1">You can also paste images from clipboard</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-plandala-text">Uploading images...</span>
            <span className="text-sm text-plandala-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-plandala-surface rounded-full h-2">
            <div
              className="bg-gradient-to-r from-plandala-cyan-400 to-plandala-magenta-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Preview Uploading Images */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Uploading ${index + 1}`}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Images */}
      {existingImages.filter((url) => !removedExistingImages.includes(url)).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {existingImages
            .filter((url) => !removedExistingImages.includes(url))
            .map((url, index) => (
              <div key={`existing-${index}`} className="relative group aspect-video rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative group aspect-video rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeUploadedImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
