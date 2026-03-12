import { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImagesSelected }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const imagesRef = useRef([]);

  // Keep ref updated with current images
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Cleanup blob URLs only on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imagesRef.current.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []); // Only run cleanup on unmount

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const removeImage = (id) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Your Trip/Party Images</h2>
      <p className="subtitle">Upload multiple images to capture the vibe of your experience</p>

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${images.length > 0 ? 'has-images' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {images.length === 0 ? (
          <div className="dropzone-content">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="dropzone-text">Drag and drop images here</p>
            <p className="dropzone-subtext">or click to browse</p>
          </div>
        ) : (
          <div className="dropzone-prompt">
            <p>Click or drag to add more images</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((img) => (
            <div key={img.id} className="image-preview-item">
              <img src={img.preview} alt="Preview" />
              <button
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
