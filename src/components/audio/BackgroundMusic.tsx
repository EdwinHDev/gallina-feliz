import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import './BackgroundMusic.css';

interface BackgroundMusicProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  src,
  autoPlay = true,
  loop = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  // Obtener el volumen y estado de silenciado de la música desde el store
  const musicVolume = useGameStore(state => state.audioConfig.musicVolume);
  const isMusicMuted = useGameStore(state => state.audioConfig.isMusicMuted);
  
  // Actualizar el volumen cuando cambie en el store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Aplicar el volumen considerando si está silenciado
    audio.volume = isMusicMuted ? 0 : musicVolume;
  }, [musicVolume, isMusicMuted]);
  
  // Inicializar el audio cuando el componente se monta
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Configurar propiedades iniciales
    audio.volume = isMusicMuted ? 0 : musicVolume;
    audio.loop = loop;
    
    // Si autoPlay está activado, reproducir el audio
    if (autoPlay) {
      // Necesitamos manejar la promesa para evitar errores en la consola
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // La reproducción automática fue impedida (política del navegador)
            console.warn('Autoplay was prevented:', error);
            setIsPlaying(false);
          });
      }
    }
    
    // Limpieza cuando el componente se desmonta
    return () => {
      audio.pause();
    };
  }, [autoPlay, loop, musicVolume, isMusicMuted]);
  
  return (
    <div className="background-music">
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default BackgroundMusic; 