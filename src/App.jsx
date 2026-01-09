import { useState, useRef, useEffect } from 'react';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const resultsRef = useRef(null);

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
    setError('');
    setAnalysisComplete(false);
    setImageAnalysis(null);
    setSongData(null);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setError('');
  };

  const handleAnalyzeImages = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setIsLoading(true);

    try {
      setStep('analyze');
      const analysis = await analyzeImages(images, apiKey);
      setImageAnalysis(analysis);
      setAnalysisComplete(true);
      setStep('upload'); // Stay on upload view but with analysis complete
    } catch (err) {
      setError(err.message || 'Failed to analyze images. Please try again.');
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  const handleGenerateSong = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key');
      return;
    }

    if (!imageAnalysis) {
      setError('Please analyze images first');
      return;
    }

    if (!selectedGenre) {
      setError('Please select a genre');
      return;
    }

    setError('');
    setIsGenerating(true);
    setIsLoading(true);

    try {
      setStep('generate');
      const song = await generateSong(imageAnalysis, selectedGenre, apiKey);
      setSongData(song);
      setStep('result');

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to generate song. Please try again.');
      setStep('upload');
    } finally {
      setIsGenerating(false);
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
    setAnalysisComplete(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegenerate = async () => {
    if (!imageAnalysis) return;

    setError('');
    setIsGenerating(true);
    setIsLoading(true);

    try {
      setStep('generate');
      const song = await generateSong(imageAnalysis, selectedGenre, apiKey);
      setSongData(song);
      setStep('result');

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setStep('result');
    } finally {
      setIsGenerating(false);
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
            {isAnalyzing && 'Analyzing your images with AI...'}
            {isGenerating && 'Generating your song lyrics...'}
          </p>
        </div>
      )}

      <main className="app-main">
        {(step === 'upload' || step === 'result') && !isLoading && (
          <>
            <ImageUpload onImagesSelected={handleImagesSelected} />

            {/* Analyze Images Button */}
            {images.length > 0 && !analysisComplete && (
              <div className="analyze-button-container">
                <button
                  className="analyze-btn"
                  onClick={handleAnalyzeImages}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Images 🔍'}
                </button>
                <p className="button-hint">Analyze your images to understand their vibe</p>
              </div>
            )}

            {/* Analysis Complete Indicator */}
            {analysisComplete && imageAnalysis && (
              <div className="analysis-complete">
                <div className="analysis-badge">
                  <span className="badge-icon">✓</span>
                  <span className="badge-text">Images Analyzed Successfully!</span>
                </div>
                <div className="analysis-summary">
                  <p><strong>Mood:</strong> {imageAnalysis.mood}</p>
                  <p><strong>Setting:</strong> {imageAnalysis.setting}</p>
                </div>
              </div>
            )}

            {/* Genre Selection - only show after analysis */}
            {analysisComplete && (
              <GenreSelection
                selectedGenre={selectedGenre}
                onGenreSelect={handleGenreSelect}
              />
            )}

            {/* Generate Song Lyrics Button - only show after analysis AND genre selection */}
            {analysisComplete && selectedGenre && (
              <div className="generate-lyrics-button-container">
                <button
                  className={`generate-lyrics-btn ${songData ? 'regenerate' : ''}`}
                  onClick={handleGenerateSong}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="btn-spinner"></span>
                      Generating Lyrics...
                    </>
                  ) : songData ? (
                    <>🔄 Regenerate Song Lyrics</>
                  ) : (
                    <>✨ Generate Song Lyrics</>
                  )}
                </button>
                <p className="button-hint">
                  {songData
                    ? 'Generate a new version with different lyrics'
                    : 'Create custom lyrics based on your images and genre'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Results Section */}
        {step === 'result' && songData && !isLoading && (
          <div ref={resultsRef} className="results-section">
            <SongOutput
              songData={songData}
              onStartOver={handleStartOver}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Claude AI & Suno AI</p>
      </footer>
    </div>
  );
}

export default App;
