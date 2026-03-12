// Backend API URL
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin);

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
    let errorMessage = 'Failed to analyze images';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
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
    let errorMessage = 'Failed to generate song';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};
