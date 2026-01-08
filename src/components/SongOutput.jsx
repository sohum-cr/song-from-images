import { useState } from 'react';
import './SongOutput.css';

const SongOutput = ({ songData, onStartOver, onRegenerate }) => {
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyLyrics = async () => {
    const lyricsText = `${songData.title}\n\n[Verse 1]\n${songData.verse1}\n\n[Chorus]\n${songData.chorus}\n\n[Verse 2]\n${songData.verse2}\n\n[Bridge]\n${songData.bridge}\n\n[Chorus]\n${songData.chorus}`;

    await navigator.clipboard.writeText(lyricsText);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(songData.sunoPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="song-output-container">
      <div className="output-header">
        <h2>Your Song is Ready!</h2>
        <div className="action-buttons">
          <button className="secondary-btn" onClick={onRegenerate}>
            🔄 Regenerate
          </button>
          <button className="secondary-btn" onClick={onStartOver}>
            ↺ Start Over
          </button>
        </div>
      </div>

      <div className="song-details">
        <div className="song-title-section">
          <h1 className="song-title">{songData.title}</h1>
          <div className="song-meta">
            <span className="meta-tag">{songData.genre}</span>
            <span className="meta-tag">{songData.mood}</span>
            <span className="meta-tag">{songData.tempo}</span>
          </div>
        </div>

        <div className="lyrics-section">
          <div className="section-header">
            <h3>Lyrics</h3>
            <button
              className={`copy-btn ${copiedLyrics ? 'copied' : ''}`}
              onClick={handleCopyLyrics}
            >
              {copiedLyrics ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          <div className="lyrics-content">
            <div className="lyric-block">
              <span className="lyric-label">[Verse 1]</span>
              <p className="lyric-text">{songData.verse1}</p>
            </div>

            <div className="lyric-block">
              <span className="lyric-label">[Chorus]</span>
              <p className="lyric-text">{songData.chorus}</p>
            </div>

            <div className="lyric-block">
              <span className="lyric-label">[Verse 2]</span>
              <p className="lyric-text">{songData.verse2}</p>
            </div>

            <div className="lyric-block">
              <span className="lyric-label">[Bridge]</span>
              <p className="lyric-text">{songData.bridge}</p>
            </div>

            <div className="lyric-block">
              <span className="lyric-label">[Chorus]</span>
              <p className="lyric-text">{songData.chorus}</p>
            </div>
          </div>
        </div>

        <div className="suno-prompt-section">
          <div className="section-header">
            <h3>Suno AI Prompt</h3>
            <button
              className={`copy-btn ${copiedPrompt ? 'copied' : ''}`}
              onClick={handleCopyPrompt}
            >
              {copiedPrompt ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          <div className="prompt-content">
            <code>{songData.sunoPrompt}</code>
          </div>

          <div className="instructions">
            <h4>How to use with Suno.ai:</h4>
            <ol>
              <li>Copy the Suno AI prompt above</li>
              <li>Go to <a href="https://suno.ai" target="_blank" rel="noopener noreferrer">suno.ai</a></li>
              <li>Click "Create" and paste the prompt</li>
              <li>Add your lyrics in the lyrics section</li>
              <li>Generate your song!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongOutput;
