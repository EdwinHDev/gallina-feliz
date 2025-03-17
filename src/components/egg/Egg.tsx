import React from 'react';
import { Position, EggState } from '../../types/types';
import { NormalEgg, CrackedEgg, HatchingEgg } from '../assets';
import './Egg.css';

interface EggProps {
  position: Position;
  state: EggState;
}

// Memoizamos componentes SVG individuales
const MemoizedNormalEgg = React.memo(NormalEgg);
const MemoizedCrackedEgg = React.memo(CrackedEgg);
const MemoizedHatchingEgg = React.memo(HatchingEgg);

const Egg: React.FC<EggProps> = React.memo(({ position, state }) => {
  // Función para renderizar el componente adecuado según el estado
  const renderEggComponent = () => {
    switch (state) {
      case 'normal':
        return <MemoizedNormalEgg />;
      case 'cracked':
        return <MemoizedCrackedEgg />;
      case 'hatching':
        return <MemoizedHatchingEgg />;
      case 'disappeared':
        return null; // No renderizamos nada si el huevo ha desaparecido
      default:
        return <MemoizedNormalEgg />;
    }
  };
  
  // Si el estado es "disappeared", agregamos una clase para la animación de desaparición
  const eggClass = `egg egg-${state} ${state === 'disappeared' ? 'egg-disappearing' : ''}`;
  
  return (
    <div 
      className={eggClass} 
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%` 
      }}
    >
      {renderEggComponent()}
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si la posición o el estado cambian
  return prevProps.state === nextProps.state && 
         prevProps.position.x === nextProps.position.x &&
         prevProps.position.y === nextProps.position.y;
});

export default Egg;