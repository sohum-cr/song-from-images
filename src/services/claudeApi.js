// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Convert image file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Get media type from file
const getMediaType = (file) => {
  const type = file.type;
  if (type === 'image/jpeg' || type === 'image/jpg') return 'image/jpeg';
  if (type === 'image/png') return 'image/png';
  if (type === 'image/gif') return 'image/gif';
  if (type === 'image/webp') return 'image/webp';
  return 'image/jpeg'; // default
};

export const analyzeImages = async (images, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (!images || images.length === 0) {
    throw new Error('No images provided');
  }

  // Convert all images to base64
  const imageData = await Promise.all(
    images.map(async (img) => {
      const base64 = await fileToBase64(img.file);
      return {
        mediaType: getMediaType(img.file),
        data: base64
      };
    })
  );

  // Call backend API
  const response = await fetch(`${API_URL}/api/analyze-images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: imageData,
      apiKey: apiKey
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze images');
  }

  return await response.json();
};

export const generateSong = async (imageAnalysis, genre, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Call backend API
  const response = await fetch(`${API_URL}/api/generate-song`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageAnalysis,
      genre,
      apiKey
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate song');
  }

  return await response.json();
};
