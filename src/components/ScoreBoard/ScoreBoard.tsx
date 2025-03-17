import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import './ScoreBoard.css';

const ScoreBoard: React.FC = () => {
  const eggCount = useGameStore(state => state.eggCount);
  
  return (
    <div className="score-board">
      <div className="score-label">Huevitos</div>
      <div className="score-item">
        <span className="score-icon">🥚</span>
        <span className="score-value">{eggCount}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;