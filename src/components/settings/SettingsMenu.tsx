import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import './SettingsMenu.css';

const SettingsMenu: React.FC = () => {
  const isSettingsMenuOpen = useGameStore(state => state.isSettingsMenuOpen);
  const toggleSettingsMenu = useGameStore(state => state.toggleSettingsMenu);
  
  const musicVolume = useGameStore(state => state.audioConfig.musicVolume);
  const effectsVolume = useGameStore(state => state.audioConfig.effectsVolume);
  const isMusicMuted = useGameStore(state => state.audioConfig.isMusicMuted);
  const isEffectsMuted = useGameStore(state => state.audioConfig.isEffectsMuted);
  const maxChickens = useGameStore(state => state.maxChickens);
  
  const setMusicVolume = useGameStore(state => state.setMusicVolume);
  const setEffectsVolume = useGameStore(state => state.setEffectsVolume);
  const toggleMusicMute = useGameStore(state => state.toggleMusicMute);
  const toggleEffectsMute = useGameStore(state => state.toggleEffectsMute);
  const setMaxChickens = useGameStore(state => state.setMaxChickens);

  // Convertir valores de volumen (0-1) a porcentajes (0-100)
  const musicVolumePercent = Math.round(musicVolume * 100);
  const effectsVolumePercent = Math.round(effectsVolume * 100);

  // Determinar qué iconos mostrar según el estado
  const musicIcon = isMusicMuted ? '🔇' : '🔊';
  const effectsIcon = isEffectsMuted ? '🔇' : '🔊';

  // Manejadores para los cambios de volumen
  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setMusicVolume(newVolume);
  };

  const handleEffectsVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setEffectsVolume(newVolume);
  };

  const handleMaxChickensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    setMaxChickens(newCount);
  };

  return (
    <>
      {/* Siempre mostrar el botón de configuración */}
      <button 
        className="settings-button"
        onClick={toggleSettingsMenu}
        title="Configuración"
      >
        ⚙️
      </button>
      
      {/* Mostrar el menú solo si está abierto */}
      {isSettingsMenuOpen && (
        <div className="settings-menu">
          <div className="settings-header">
            <h2>Configuración</h2>
            <button 
              className="close-button"
              onClick={toggleSettingsMenu}
            >
              ✖
            </button>
          </div>

          <div className="settings-content">
            <div className="volume-control">
              <div className="volume-header">
                <label htmlFor="music-volume">
                  Volumen de Música: {musicVolumePercent}%
                </label>
                <button 
                  className="mute-button"
                  onClick={toggleMusicMute}
                  title={isMusicMuted ? "Activar música" : "Silenciar música"}
                >
                  {musicIcon}
                </button>
              </div>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="100"
                value={musicVolumePercent}
                onChange={handleMusicVolumeChange}
                disabled={isMusicMuted}
              />
            </div>

            <div className="volume-control">
              <div className="volume-header">
                <label htmlFor="effects-volume">
                  Volumen de Efectos: {effectsVolumePercent}%
                </label>
                <button 
                  className="mute-button"
                  onClick={toggleEffectsMute}
                  title={isEffectsMuted ? "Activar efectos" : "Silenciar efectos"}
                >
                  {effectsIcon}
                </button>
              </div>
              <input
                id="effects-volume"
                type="range"
                min="0"
                max="100"
                value={effectsVolumePercent}
                onChange={handleEffectsVolumeChange}
                disabled={isEffectsMuted}
              />
            </div>

            <div className="volume-control">
              <div className="volume-header">
                <label htmlFor="max-chickens">
                  Cantidad de Pollos: {maxChickens}
                </label>
              </div>
              <input
                id="max-chickens"
                type="range"
                min="10"
                max="100"
                value={maxChickens}
                onChange={handleMaxChickensChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsMenu; 