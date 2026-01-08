import { useState } from 'react';
import './GenreSelection.css';

const GENRES = [
  { id: 'pop', name: 'Pop', icon: '🎤', description: 'Catchy and upbeat' },
  { id: 'rock', name: 'Rock', icon: '🎸', description: 'Energetic and bold' },
  { id: 'hiphop', name: 'Hip Hop', icon: '🎧', description: 'Rhythmic and smooth' },
  { id: 'country', name: 'Country', icon: '🤠', description: 'Heartfelt and storytelling' },
  { id: 'edm', name: 'EDM', icon: '🎵', description: 'Electronic and danceable' },
  { id: 'indie', name: 'Indie', icon: '🎹', description: 'Unique and authentic' },
  { id: 'rnb', name: 'R&B', icon: '✨', description: 'Soulful and groovy' },
  { id: 'folk', name: 'Folk', icon: '🪕', description: 'Acoustic and warm' }
];

const GenreSelection = ({ selectedGenre, onGenreSelect }) => {
  return (
    <div className="genre-selection-container">
      <h2>Choose Your Genre</h2>
      <p className="subtitle">Select the music style that matches your vibe</p>

      <div className="genre-grid">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            className={`genre-card ${selectedGenre === genre.id ? 'selected' : ''}`}
            onClick={() => onGenreSelect(genre.id)}
          >
            <span className="genre-icon">{genre.icon}</span>
            <span className="genre-name">{genre.name}</span>
            <span className="genre-description">{genre.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelection;
