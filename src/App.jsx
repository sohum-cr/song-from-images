import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import GenreSelection from './components/GenreSelection';
import ProgressIndicator from './components/ProgressIndicator';
import SongOutput from './components/SongOutput';
import { analyzeImages, generateSong } from './services/claudeApi';
import './App.css';

function App() {
  const [step, setStep] = useState('upload'); // upload, analyze, generate, result
  const [images, setImages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [songData, setSongData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
    setError('');
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setError('');
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!selectedGenre) {
      setError('Please select a genre');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Step 1: Analyze images
      setStep('analyze');
      const analysis = await analyzeImages(images, apiKey);
      setImageAnalysis(analysis);

      // Step 2: Generate song
      setStep('generate');
      const song = await generateSong(analysis, selectedGenre, apiKey);
      setSongData(song);

      // Step 3: Show results
      setStep('result');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('upload');
    setImages([]);
    setSelectedGenre('');
    setImageAnalysis(null);
    setSongData(null);
    setError('');
  };

  const handleRegenerate = async () => {
    if (!imageAnalysis) return;

    setError('');
    setIsLoading(true);

    try {
      setStep('generate');
      const song = await generateSong(imageAnalysis, selectedGenre, apiKey);
      setSongData(song);
      setStep('result');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🎵 Song From Images</h1>
        <p className="app-subtitle">Turn your trip & party memories into custom songs</p>
      </header>

      <div className="api-key-section">
        <input
          type="password"
          placeholder="Enter your Anthropic API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="api-key-input"
        />
        <p className="api-key-hint">
          Get your API key from{' '}
          <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
            console.anthropic.com
          </a>
        </p>
      </div>

      <ProgressIndicator currentStep={step} />

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            {step === 'analyze' && 'Analyzing your images...'}
            {step === 'generate' && 'Generating your song...'}
          </p>
        </div>
      )}

      <main className="app-main">
        {step === 'upload' && !isLoading && (
          <>
            <ImageUpload onImagesSelected={handleImagesSelected} />

            <GenreSelection
              selectedGenre={selectedGenre}
              onGenreSelect={handleGenreSelect}
            />

            {images.length > 0 && selectedGenre && (
              <div className="generate-button-container">
                <button className="generate-btn" onClick={handleGenerate}>
                  Generate My Song 🎵
                </button>
              </div>
            )}
          </>
        )}

        {step === 'result' && songData && !isLoading && (
          <SongOutput
            songData={songData}
            onStartOver={handleStartOver}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Claude AI & Suno AI</p>
      </footer>
    </div>
  );
}

export default App;
