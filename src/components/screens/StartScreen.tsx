import React from 'react';
import '../../styles/StartScreen.css';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <a 
          href="https://lojitastudio.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="start-logo-link"
        >
          <img 
            src="/images/logo.png" 
            alt="Gallina Feliz" 
            className="start-logo"
          />
        </a>
        <h1 className="start-title">Gallina Feliz</h1>
        <p className="start-subtitle">¡Cría tus animales y cosecha felicidad!</p>
        <button 
          className="start-button"
          onClick={onStartGame}
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 