import { useState, useEffect } from 'react';

function ImageUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // Allowed MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  // Validate file type and size
  const validateFile = (file) => {
    if (!allowedMimeTypes.includes(file.type)) {
      return 'Please select an image file (jpeg, png, webp, or gif)';
    }
    if (file.size > maxFileSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File too large: ${fileSizeMB}MB. Maximum size is 5MB.`;
    }
    return null;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Clear previous preview URL before setting new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // File is valid
    setSelectedFile(file);
    setError(null);
    
    // Generate preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle form submission - build FormData
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile || error) {
      return;
    }

    // Create FormData and append file
    const formData = new FormData();
    formData.append('image', selectedFile);

    // Call parent's upload handler
    if (onUpload) {
      onUpload(formData);
    }
  };

  // Cleanup blob URLs on component unmount or previewUrl change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="image-upload">
      <form onSubmit={handleSubmit}>
        {/* File Input */}
        <div className="file-input-container">
          <label htmlFor="file-input" className="file-label">
            Choose Image
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Image Preview */}
        {previewUrl && !error && (
          <div className="image-preview">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="preview-image"
            />
          </div>
        )}

        {/* Upload Button */}
        <button 
          type="submit" 
          className="upload-button"
          disabled={!selectedFile || !!error}
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default ImageUpload;
