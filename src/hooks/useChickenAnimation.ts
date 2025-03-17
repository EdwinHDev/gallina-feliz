import { useGameStore } from '../store/useGameStore';

// Hook personalizado para obtener el estado de animación
export const useChickenAnimation = (id: string) => {
  const defaultState = { 
    isHatching: false, 
    isJumping: false, 
    hasLanded: false 
  };
  
  const animationState = useGameStore(state => 
    state.chickenAnimationStates[id] || defaultState
  );
  
  return animationState;
};