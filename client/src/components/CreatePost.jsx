import { useState } from 'react';
import ImageUpload from './ImageUpload';
import api from '../services/api';
import toast from 'react-hot-toast';

function CreatePost({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Handle the upload - send FormData to /api/upload
  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError(null);

    try {
      // Send FormData to backend - do NOT set Content-Type header
      const response = await api.post('/api/upload', formData);
      
      if (response.data.success) {
        // Store the returned URL
        setCoverImageUrl(response.data.url);
        toast.success('Image uploaded!');
        console.log('Image uploaded, URL:', response.data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.message || 'Upload failed. Please try again.';
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      // Always reset loading state
      setUploading(false);
    }
  };

  // Handle post creation submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Please fill in title and content');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare post data - include coverImageUrl (will be null if no image uploaded)
      const postData = {
        title,
        content,
        author: 'CurrentUser', // Would come from auth context in production
        coverImage: coverImageUrl
      };

      // Create the post
      const response = await api.post('/api/posts', postData);

      if (response.data) {
        toast.success('Post created!');
        console.log('Post created:', response.data);
        
        // Reset form after success
        setTitle('');
        setContent('');
        setCoverImageUrl(null);
        
        // Call onSuccess callback if provided (for navigation)
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Post creation failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create post. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      
      {/* Upload Error Display */}
      {uploadError && (
        <div className="upload-error">
          {uploadError}
        </div>
      )}

      {/* Upload Loading State */}
      {uploading && (
        <div className="loading-indicator">
          Uploading image...
        </div>
      )}

      <form onSubmit={handlePostSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
            rows="4"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <ImageUpload onUpload={handleUpload} />
        </div>

        {/* Show current image status */}
        {coverImageUrl && (
          <div className="image-status">
            <p>Image attached ✓</p>
            <img 
              src={coverImageUrl} 
              alt="Cover preview" 
              className="cover-preview"
            />
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting || uploading}
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
