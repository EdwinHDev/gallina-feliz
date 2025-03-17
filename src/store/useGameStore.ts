import { create } from 'zustand';
import { Position, Egg, Chicken, ChickenAnimationState } from '../types/types';

// Posibles pantallas de la aplicación
export type GameScreen = 'loading' | 'start' | 'game' | 'victory';

// Añadir interfaz para la configuración de audio
interface AudioConfig {
  musicVolume: number;
  effectsVolume: number;
  isMusicMuted: boolean;
  isEffectsMuted: boolean;
}

interface GameState {
  chickens: Chicken[];
  eggs: Egg[];
  usedPositions: Position[];
  eggCount: number;
  chickenAnimationStates: Record<string, ChickenAnimationState>;
  audioConfig: AudioConfig;
  currentScreen: GameScreen;
  isSettingsMenuOpen: boolean;
  maxChickens: number;
  
  // Acciones
  addEgg: (parentId: string, position: Position) => void;
  moveChicken: (id: string) => void;
  updateEggStates: () => void;
  startHatching: () => void;
  finishHatching: (eggId: number) => void;
  updateChickenAnimationState: (chickenId: string, state: Partial<ChickenAnimationState>) => void;
  generateNewPosition: () => Position;
  startRandomClucking: () => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleMusicMute: () => void;
  toggleEffectsMute: () => void;
  toggleSettingsMenu: () => void;
  exitGame: () => void;
  resetGame: () => void;
  setMaxChickens: (count: number) => void;
}

const initialState = {
  chickens: [{ id: 'initial', position: { x: 50, y: 50 } }],
  eggs: [],
  usedPositions: [{ x: 50, y: 50 }],
  eggCount: 0,
  maxChickens: Number(localStorage.getItem('maxChickens')) || 50,
  // Inicializamos el estado de animación para el pollo inicial
  chickenAnimationStates: {
    'initial': {
      isHatching: false,
      isJumping: false,
      hasLanded: false,
      isClucking: false,
      isWalking: false
    }
  },
  // Configuración de audio inicial
  audioConfig: {
    musicVolume: 0.2, // 20% por defecto
    effectsVolume: 1.0,  // 100% por defecto
    isMusicMuted: false,
    isEffectsMuted: false
  },
  currentScreen: 'loading' as GameScreen,
  isSettingsMenuOpen: false
};

// Función auxiliar para comparar estados y evitar actualizaciones innecesarias
/* const shallowEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}; */

// Función para generar un número aleatorio entre min y max
const getRandomInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  
  // Acción para añadir un huevo
  addEgg: (parentId: string, position: Position) => {
    const { chickens, maxChickens } = get();
    
    // Verificar si ya alcanzamos el límite de pollos (excluyendo el inicial)
    const chickenCount = chickens.filter(c => c.id !== 'initial').length;
    if (chickenCount >= maxChickens) {
      set({ currentScreen: 'victory' });
      return;
    }
    
    const newEgg: Egg = {
      id: Date.now(),
      position: { ...position },
      state: 'normal',
      createdAt: Date.now(),
      parentId
    };
    
    set(state => ({
      eggs: [...state.eggs, newEgg],
      eggCount: state.eggCount + 1
    }));
    
    get().moveChicken(parentId);
  },
  
  // Acción para iniciar cacareos aleatorios
  startRandomClucking: () => {
    const { chickens, chickenAnimationStates } = get();
    
    // Solo si hay pollos para cacarear
    if (chickens.length === 0) return;
    
    // Elegir un pollo aleatorio que no esté en animación
    const availableChickens = chickens.filter(chicken => {
      const state = chickenAnimationStates[chicken.id];
      return state && !state.isHatching && !state.isJumping && !state.isClucking;
    });
    
    if (availableChickens.length === 0) return;
    
    // Elegir un pollo aleatorio
    const randomIndex = Math.floor(Math.random() * availableChickens.length);
    const chickenToCluck = availableChickens[randomIndex];
    
    // Iniciar la animación de cacareo
    set(state => ({
      chickenAnimationStates: {
        ...state.chickenAnimationStates,
        [chickenToCluck.id]: {
          ...state.chickenAnimationStates[chickenToCluck.id],
          isClucking: true
        }
      }
    }));
    
    // Programar el próximo cacareo aleatorio
    setTimeout(() => {
      get().startRandomClucking();
    }, getRandomInterval(3000, 6000)); // Entre 3 y 6 segundos
  },
  
  // Acción para mover un pollo
  moveChicken: (id: string) => {
    const newPosition = get().generateNewPosition();
    
    // Primero activamos la animación de salto
    set(state => ({
      chickenAnimationStates: {
        ...state.chickenAnimationStates,
        [id]: {
          ...state.chickenAnimationStates[id],
          isJumping: true
        }
      }
    }));
    
    // Después de la animación de salto, activamos la de caminar
    setTimeout(() => {
      set(state => ({
        chickenAnimationStates: {
          ...state.chickenAnimationStates,
          [id]: {
            ...state.chickenAnimationStates[id],
            isJumping: false,
            isWalking: true
          }
        }
      }));
      
      // Actualizamos la posición casi inmediatamente después de comenzar a caminar
      setTimeout(() => {
        set(state => ({
          chickens: state.chickens.map(chicken => 
            chicken.id === id 
              ? { ...chicken, position: newPosition }
              : chicken
          ),
          usedPositions: [...state.usedPositions, newPosition]
        }));
        
        // Y después de que termine la animación de caminar, la desactivamos
        setTimeout(() => {
          set(state => ({
            chickenAnimationStates: {
              ...state.chickenAnimationStates,
              [id]: {
                ...state.chickenAnimationStates[id],
                isWalking: false
              }
            }
          }));
        }, 1200); // Duración de la animación de caminar
      }, 100); // Retraso mínimo antes de comenzar a moverse
    }, 780); // Duración de la animación de salto (un poco menos que la animación CSS para asegurar fluidez)
  },
  
  // Generar una nueva posición
  generateNewPosition: (): Position => {
    // Implementación existente
    const { usedPositions } = get();
    let newPosition: Position;
    let attempts = 0;
    
    do {
      newPosition = {
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10
      };
      
      attempts++;
      if (attempts > 100) break;
    } while (
      usedPositions.some(pos => 
        Math.abs(pos.x - newPosition.x) < 10 && 
        Math.abs(pos.y - newPosition.y) < 10
      )
    );
    
    return newPosition;
  },
  
  // Actualizar los estados de los huevos
  updateEggStates: () => {
    const now = Date.now();
    const { eggs } = get();
    
    // Primero comprobamos si necesitamos hacer algún cambio
    const needsUpdate = eggs.some(egg => {
      const ageInSeconds = (now - egg.createdAt) / 1000;
      return (ageInSeconds >= 10 && egg.state === 'cracked') || 
             (ageInSeconds >= 5 && egg.state === 'normal');
    });
    
    // Solo actualizamos si es necesario
    if (needsUpdate) {
      set(state => ({
        eggs: state.eggs.map(egg => {
          const ageInSeconds = (now - egg.createdAt) / 1000;
          
          if (ageInSeconds >= 10 && egg.state === 'cracked') {
            return { ...egg, state: 'hatching' };
          } else if (ageInSeconds >= 5 && egg.state === 'normal') {
            return { ...egg, state: 'cracked' };
          }
          return egg;
        })
      }));
      
      // Solo iniciamos el proceso si hay huevos que necesitan eclosionar
      const hatchingEggs = get().eggs.filter(egg => egg.state === 'hatching');
      if (hatchingEggs.length > 0) {
        get().startHatching();
      }
    }
  },
  
  // Iniciar el proceso de eclosión
  startHatching: () => {
    const { eggs, chickens, maxChickens } = get();
    
    // Verificar si ya alcanzamos el límite de pollos (excluyendo el inicial)
    const chickenCount = chickens.filter(c => c.id !== 'initial').length;
    if (chickenCount >= maxChickens) {
      set({ currentScreen: 'victory' });
      return;
    }
    
    const hatchingEggs = eggs.filter(egg => 
      egg.state === 'hatching' && 
      !egg.chickenId
    );
    
    if (hatchingEggs.length === 0) return;

    hatchingEggs.forEach(egg => {
      // Verificar nuevamente el límite antes de crear cada pollo
      const currentChickenCount = get().chickens.filter(c => c.id !== 'initial').length;
      if (currentChickenCount >= maxChickens) {
        set({ currentScreen: 'victory' });
        return;
      }

      // Generar un ID único para el nuevo pollo
      const chickenId = `chicken-${egg.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Verificar que no exista ya un pollo con este ID
      if (chickens.some(chicken => chicken.id === chickenId)) return;
      
      // Crear inmediatamente el pollo visible y asignar ID al huevo en estado hatching
      set(state => {
        const newState = {
          ...state,
          chickens: [...state.chickens, {
            id: chickenId,
            position: { ...egg.position }
          }],
          chickenAnimationStates: {
            ...state.chickenAnimationStates,
            [chickenId]: {
              isHatching: true,
              isJumping: false, 
              hasLanded: false,
              isClucking: false,
              isWalking: false
            }
          },
          eggs: state.eggs.map(e => 
            e.id === egg.id ? { ...e, chickenId } : e
          )
        };

        // Verificar si con este nuevo pollo alcanzamos el límite (excluyendo el inicial)
        const finalChickenCount = newState.chickens.filter(c => c.id !== 'initial').length;
        if (finalChickenCount === maxChickens) {
          newState.currentScreen = 'victory';
        }

        return newState;
      });
      
      // Después del tiempo en estado 'hatching' (1 segundo), 
      // cambiamos el huevo a estado 'disappeared' para iniciar la animación de desvanecimiento
      setTimeout(() => {
        set(state => ({
          eggs: state.eggs.map(e => 
            e.id === egg.id ? { ...e, state: 'disappeared' } : e
          )
        }));
      }, 1000);
      
      // Después de dar tiempo para la animación de desaparición completa
      setTimeout(() => {
        set(state => ({
          eggs: state.eggs.filter(e => e.id !== egg.id)
        }));
      }, 3500); // 1000ms en hatching + 2500ms para la animación de desaparición
    });
  },
  
  // Finalizar el proceso de eclosión
  finishHatching: (eggId: number) => {
    const { chickens, maxChickens } = get();
    
    if (chickens.length >= maxChickens) {
      // Si llegamos al límite, mostramos el modal de victoria
      set({ currentScreen: 'victory' });
      return;
    }
    
    set(state => ({
      eggs: state.eggs.filter(egg => egg.id !== eggId)
    }));
  },
  
  // Actualizar el estado de animación de un pollo
  updateChickenAnimationState: (chickenId: string, state: Partial<ChickenAnimationState>) => {
    // Verificar que el chickenId existe en el estado
    const currentState = get().chickenAnimationStates[chickenId];
    if (!currentState) return;
    
    // Verificar si hay cambios reales antes de actualizar
    const newState = { ...currentState, ...state };
    if (
      newState.isHatching === currentState.isHatching &&
      newState.isJumping === currentState.isJumping &&
      newState.hasLanded === currentState.hasLanded &&
      newState.isClucking === currentState.isClucking
    ) {
      return; // No hay cambios, evitar actualizaciones innecesarias
    }
    
    set(prevState => ({
      chickenAnimationStates: {
        ...prevState.chickenAnimationStates,
        [chickenId]: newState
      }
    }));
  },
  
  // Acciones para el control de volumen
  setMusicVolume: (volume: number) => {
    set(state => ({
      audioConfig: {
        ...state.audioConfig,
        musicVolume: volume
      }
    }));
  },
  
  setEffectsVolume: (volume: number) => {
    set(state => ({
      audioConfig: {
        ...state.audioConfig,
        effectsVolume: volume
      }
    }));
  },
  
  toggleMusicMute: () => {
    set(state => ({
      audioConfig: {
        ...state.audioConfig,
        isMusicMuted: !state.audioConfig.isMusicMuted
      }
    }));
  },
  
  toggleEffectsMute: () => {
    set(state => ({
      audioConfig: {
        ...state.audioConfig,
        isEffectsMuted: !state.audioConfig.isEffectsMuted
      }
    }));
  },
  
  toggleSettingsMenu: () => {
    set(state => ({
      isSettingsMenuOpen: !state.isSettingsMenuOpen
    }));
  },
  
  exitGame: () => {
    set(state => ({
      chickens: [{ id: 'initial', position: { x: 50, y: 50 } }],
      eggs: [],
      usedPositions: [{ x: 50, y: 50 }],
      eggCount: 0,
      chickenAnimationStates: {
        'initial': {
          isHatching: false,
          isJumping: false,
          hasLanded: false,
          isClucking: false,
          isWalking: false
        }
      },
      audioConfig: {
        ...state.audioConfig,
        isMusicMuted: false,
        isEffectsMuted: false
      },
      currentScreen: 'start' as GameScreen,
      isSettingsMenuOpen: false
    }));
  },
  
  resetGame: () => {
    set(state => ({
      chickens: [{ id: 'initial', position: { x: 50, y: 50 } }],
      eggs: [],
      usedPositions: [{ x: 50, y: 50 }],
      eggCount: 0,
      chickenAnimationStates: {
        'initial': {
          isHatching: false,
          isJumping: false,
          hasLanded: false,
          isClucking: false,
          isWalking: false
        }
      },
      audioConfig: {
        ...state.audioConfig
      },
      currentScreen: 'game' as GameScreen,
      isSettingsMenuOpen: false
    }));
  },
  
  setMaxChickens: (count: number) => {
    set({ maxChickens: count });
    localStorage.setItem('maxChickens', count.toString());
  }
}));