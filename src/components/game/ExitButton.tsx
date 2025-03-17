import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import './ExitButton.css';

/**
 * Botón para salir del juego, diseñado para ser intuitivo para niños
 */
const ExitButton: React.FC = () => {
  const exitGame = useGameStore(state => state.exitGame);

  return (
    <button
      className="exit-button"
      onClick={exitGame}
      title="Terminar juego y volver al inicio"
    >
      <span className="exit-icon">🏠</span>
    </button>
  );
};

export default ExitButton; 