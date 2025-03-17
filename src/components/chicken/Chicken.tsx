import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Chicken as ChickenSvg } from '../assets';
import { playSound, SOUNDS } from '../../utils/AudioUtils';
import './Chicken.css';

interface ChickenProps {
  id: string;
  position: { x: number; y: number };
}

const Chicken: React.FC<ChickenProps> = ({ id, position }) => {
  const chickenAnimationState = useGameStore(state => state.chickenAnimationStates[id] || {});
  const { isHatching, isClucking, isWalking, isJumping } = chickenAnimationState;
  const updateChickenAnimationState = useGameStore(state => state.updateChickenAnimationState);
  const addEgg = useGameStore(state => state.addEgg);
  
  // Referencia para controlar el timeout de animación
  const birthTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cluckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Gestionar la animación del pollo
  useEffect(() => {
    if (isHatching) {
      // Limpiar cualquier timeout anterior
      if (birthTimeoutRef.current) {
        clearTimeout(birthTimeoutRef.current);
      }
      
      // Reproducir el sonido de salto y cacareo
      try {
        playSound(SOUNDS.JUMP, 0.4);
        playSound(SOUNDS.CLUCK, 0.7);
      } catch (error) {
        console.log('Sonidos no disponibles');
      }
      
      // Programar el fin de la animación
      birthTimeoutRef.current = setTimeout(() => {
        updateChickenAnimationState(id, {
          isHatching: false
        });
      }, 800); // Duración de la animación de salto
    }
    
    return () => {
      if (birthTimeoutRef.current) {
        clearTimeout(birthTimeoutRef.current);
      }
    };
  }, [id, isHatching, updateChickenAnimationState]);
  
  // Gestionar la animación de cacareo
  useEffect(() => {
    if (isClucking) {
      // Reproducir el sonido de cacareo
      playSound(SOUNDS.CLUCK, 0.7);
      
      // Limpiar cualquier timeout anterior
      if (cluckTimeoutRef.current) {
        clearTimeout(cluckTimeoutRef.current);
      }
      
      // Programar el fin de la animación de cacareo
      cluckTimeoutRef.current = setTimeout(() => {
        updateChickenAnimationState(id, {
          isClucking: false
        });
      }, 800); // Duración de la animación de cacareo
    }
    
    return () => {
      if (cluckTimeoutRef.current) {
        clearTimeout(cluckTimeoutRef.current);
      }
    };
  }, [id, isClucking, updateChickenAnimationState]);
  
  // Gestionar la animación de salto
  useEffect(() => {
    if (isJumping) {
      // Limpiar cualquier timeout anterior
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
      
      // Intentar reproducir el sonido de salto si está disponible
      try {
        playSound(SOUNDS.JUMP, 0.4);
      } catch (error) {
        console.log('Sonido de salto no disponible');
      }
    }
    
    return () => {
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
    };
  }, [id, isJumping]);
  
  // Gestionar la animación de caminar
  useEffect(() => {
    if (isWalking) {
      // Limpiar cualquier timeout anterior
      if (walkTimeoutRef.current) {
        clearTimeout(walkTimeoutRef.current);
      }
      
      // Intentar reproducir el sonido de caminar si está disponible
      try {
        playSound(SOUNDS.WALK, 0.3);
        
        // Reproducir el sonido nuevamente a la mitad de la animación
        setTimeout(() => {
          if (isWalking) {
            playSound(SOUNDS.WALK, 0.3);
          }
        }, 600); // Mitad de la duración de la animación (1200ms)
      } catch (error) {
        console.log('Sonido de pasos no disponible');
      }
    }
    
    return () => {
      if (walkTimeoutRef.current) {
        clearTimeout(walkTimeoutRef.current);
      }
    };
  }, [id, isWalking]);
  
  // Solo permitir clics si no está en animación
  const handleClick = () => {
    if (!isHatching && !isClucking && !isWalking && !isJumping) {
      // Reproducir el sonido de poner huevo
      playSound(SOUNDS.EGG, 0.5);
      
      // Añadir el huevo
      addEgg(id, position);
    }
  };
  
  // Determinar la animación del SVG
  const getAnimation = () => {
    if (isHatching) return 'jump';
    if (isClucking) return 'cluck';
    if (isJumping) return 'jump';
    if (isWalking) return 'walk';
    return 'idle';
  };
  
  // Determinar la clase CSS a aplicar
  const getChickenClassName = () => {
    let className = 'chicken';
    if (isHatching) className += ' chicken-jumping';
    if (isJumping) className += ' chicken-jumping';
    if (isWalking) className += ' chicken-walking chicken-moving';
    return className;
  };
  
  return (
    <div 
      className={getChickenClassName()}
      style={{left: `${position.x}%`, top: `${position.y}%`}}
      onClick={handleClick}
    >
      <ChickenSvg 
        animation={getAnimation()}
        onAnimationEnd={() => {
          if (isClucking) {
            updateChickenAnimationState(id, { isClucking: false });
          }
          if (isJumping) {
            updateChickenAnimationState(id, { isJumping: false });
          }
          if (isWalking) {
            updateChickenAnimationState(id, { isWalking: false });
          }
        }}
      />
    </div>
  );
};

export default Chicken;