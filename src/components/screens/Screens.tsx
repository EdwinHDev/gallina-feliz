import React, { useState, useEffect } from 'react';
import '../../styles/LoadingScreen.css';
import '../../styles/StartScreen.css';
import VictoryScreen from './VictoryScreen';
import { useGameStore } from '../../store/useGameStore';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 2;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 300);
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // Incremento cada 100ms para alcanzar 100% en aprox. 5 segundos

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      {/* Nubes animadas */}
      <img src="/images/cloud1.png" alt="" className="cloud cloud1" />
      <img src="/images/cloud2.png" alt="" className="cloud cloud2" />
      <img src="/images/cloud3.png" alt="" className="cloud cloud3" />
      
      {/* Animales decorativos */}
      <img src="/images/chicken.png" alt="" className="loading-animal loading-chicken" />
      <img src="/images/cow.png" alt="" className="loading-animal loading-cow" />
      <img src="/images/chicken.png" alt="" className="loading-animal loading-pig" />
      
      <div className="loading-content">
        <img 
          src="/images/logo.png" 
          alt="Gallina Feliz" 
          className="loading-logo"
        />
        <div className="loading-bar-container">
          <div className="loading-icons">
            <span className="loading-icon">🐓</span>
            <span className="loading-icon">🥚</span>
            <span className="loading-icon">🐣</span>
            <span className="loading-icon">🌱</span>
          </div>
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">Cargando: {progress}%</p>
      </div>
    </div>
  );
};

interface StartScreenProps {
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="start-screen">
      {/* Animales animados */}
      <img src="/images/chicken.png" alt="" className="farm-animal animal1" />
      <img src="/images/cow.png" alt="" className="farm-animal animal2" />
      
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
        <p className="start-subtitle">¡Cría tus pollitos y diviértete!</p>
        <button 
          className="start-button"
          onClick={onStartGame}
        >
          ¡Jugar!
        </button>
      </div>
    </div>
  );
};

export const GameScreen: React.FC = () => {
  const currentScreen = useGameStore(state => state.currentScreen);
  
  if (currentScreen === 'victory') {
    return <VictoryScreen />;
  }
  
  return (
    <div className="game-screen">
      {/* Contenido existente del juego */}
    </div>
  );
}; 