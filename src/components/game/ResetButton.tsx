import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import './ResetButton.css';

const ResetButton: React.FC = () => {
  const resetGame = useGameStore(state => state.resetGame);
  
  return (
    <button 
      className="reset-button"
      onClick={resetGame}
      title="Reiniciar juego"
    >
      🔄
    </button>
  );
};

export default ResetButton; 