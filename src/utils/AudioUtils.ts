import { useGameStore } from '../store/useGameStore';

// Función para reproducir sonidos que usa el nivel de volumen del store
export const playSound = (soundPath: string, baseVolume = 1.0): void => {
  try {
    const state = useGameStore.getState();
    const { effectsVolume, isEffectsMuted } = state.audioConfig;
    
    // Si los efectos están silenciados, no reproducir sonido
    if (isEffectsMuted) return;
    
    const audio = new Audio(soundPath);
    audio.volume = baseVolume * effectsVolume; // Multiplicamos por el nivel global
    
    // Manejar la promesa para evitar errores en consola
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn(`Error al reproducir el sonido ${soundPath}:`, error);
      });
    }
  } catch (error) {
    console.error(`Error al crear el audio ${soundPath}:`, error);
  }
};

// Rutas de los sonidos
export const SOUNDS = {
  CLUCK: '/audio/cacareo.mp3',
  EGG: '/audio/pedo.mp3',
  WALK: '/audio/pasos.mp3',
  JUMP: '/audio/salto.mp3'
}; 