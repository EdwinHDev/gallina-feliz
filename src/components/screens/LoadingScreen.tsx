import React, { useState, useEffect } from 'react';
import '../../styles/LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
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
      <div className="loading-content">
        <img 
          src="/images/logo.png" 
          alt="Granjita Feliz" 
          className="loading-logo"
        />
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">Cargando: {progress}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 