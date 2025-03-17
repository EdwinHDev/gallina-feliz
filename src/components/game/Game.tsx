import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';
import Chicken from '../chicken/Chicken';
import Egg from '../egg/Egg';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import BackgroundMusic from '../audio/BackgroundMusic';
import SettingsMenu from '../settings/SettingsMenu';
import ExitButton from './ExitButton';
import ResetButton from './ResetButton';
import { LoadingScreen, StartScreen } from '../screens/Screens';
import VictoryScreen from '../screens/VictoryScreen';
import { EggState } from '../../types/types';
import './Game.css';

// Componente para renderizar cada pollo individual
const ChickenItem = React.memo(({ id, position }: { id: string, position: { x: number, y: number } }) => {
  return <Chicken id={id} position={position} />;
});

// Componente para renderizar cada huevo individual
const EggItem = React.memo(({ id, position, state }: { id: number, position: { x: number, y: number }, state: EggState }) => {
  return <Egg key={id} position={position} state={state} />;
});

// Elementos decorativos
const GameDecorations: React.FC = () => {
  return (
    <>
      {/* Sol */}
      <img src="/images/sun.png" alt="" className="sun decoration" />
      
      {/* Nubes */}
      <img src="/images/cloud1.png" alt="" className="cloud-game cloud-game-1 decoration" />
      <img src="/images/cloud2.png" alt="" className="cloud-game cloud-game-2 decoration" />
      
      {/* Árboles */}
      <img src="/images/tree.png" alt="" className="tree tree-left decoration" />
      <img src="/images/tree.png" alt="" className="tree tree-right decoration" />
      
      {/* Flores */}
      <img src="/images/flower1.png" alt="" className="flower flower1 decoration" />
      <img src="/images/flower2.png" alt="" className="flower flower2 decoration" />
      <img src="/images/flower1.png" alt="" className="flower flower3 decoration" />
      <img src="/images/flower2.png" alt="" className="flower flower4 decoration" />
      
      {/* Cerca */}
      <img src="/images/fence.png" alt="" className="fence decoration" />
    </>
  );
};

const Game: React.FC = () => {
  // Obtener el estado actual de la pantalla
  const currentScreen = useGameStore(state => state.currentScreen);
  
  // Acciones para cambiar de pantalla
  // const setMusicPlaying = () => {}; // Mantenemos esto para compatibilidad
  
  // Usar selectores estables con useCallback para evitar re-renderizados infinitos
  const chickens = useGameStore(useCallback(state => state.chickens, []));
  const eggs = useGameStore(useCallback(state => state.eggs, []));
  const updateEggStates = useGameStore(useCallback(state => state.updateEggStates, []));
  const startRandomClucking = useGameStore(useCallback(state => state.startRandomClucking, []));
  
  // Manejador para cuando se completa la carga
  const handleLoadingComplete = () => {
    useGameStore.setState({ currentScreen: 'start' });
  };
  
  // Manejador para cuando se inicia el juego
  const handleStartGame = () => {
    useGameStore.setState({ currentScreen: 'game' });
  };
  
  // Efecto para actualizar los estados de los huevos regularmente
  useEffect(() => {
    // Solo iniciar el temporizador cuando estamos en la pantalla de juego
    if (currentScreen !== 'game') return;
    
    // Usar una variable de referencia para evitar memory leaks
    let isMounted = true;
    
    const eggTimer = setInterval(() => {
      if (isMounted) {
        try {
          updateEggStates();
        } catch (error) {
          console.error("Error updating egg states:", error);
          // Limpiar el intervalo si hay un error para evitar bucles infinitos
          clearInterval(eggTimer);
        }
      }
    }, 1000);
    
    return () => {
      isMounted = false;
      clearInterval(eggTimer);
    };
  }, [updateEggStates, currentScreen]);
  
  // Efecto para iniciar los cacareos aleatorios
  useEffect(() => {
    // Solo iniciar los cacareos cuando estamos en la pantalla de juego
    if (currentScreen !== 'game') return;
    
    // Iniciamos los cacareos aleatorios cuando el componente se monta
    // El temporizador para el siguiente cacareo lo maneja la propia función
    startRandomClucking();
    
    // No es necesario limpiar nada aquí ya que el temporizador interno
    // se limpiará automáticamente cuando el componente se desmonte
  }, [startRandomClucking, currentScreen]);
  
  // Renderiza la pantalla correspondiente según el estado actual
  if (currentScreen === 'loading') {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }
  
  if (currentScreen === 'start') {
    return <StartScreen onStartGame={handleStartGame} />;
  }
  
  // Pantalla de juego (ahora incluye el modal de victoria cuando corresponda)
  return (
    <div className="game-container">
      {/* Música de fondo */}
      <BackgroundMusic 
        src="/audio/farm-background.mp3" 
        autoPlay={true} 
        loop={true} 
      />

      {/* Logo con enlace */}
      <a 
        href="https://lojitastudio.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="studio-logo"
      >
        <img src="/images/logo.png" alt="Lojita Studio" />
      </a>

      {/* Elementos decorativos */}
      <GameDecorations />
      
      {/* Botones de control */}
      <SettingsMenu />
      <ResetButton />
      <ExitButton />
      
      {/* Marcador */}
      <ScoreBoard />
      
      {/* Huevos */}
      {eggs.map(egg => (
        <EggItem 
          key={egg.id}
          id={egg.id}
          position={egg.position}
          state={egg.state}
        />
      ))}
      
      {/* Pollos */}
      {chickens.map(chicken => (
        <ChickenItem 
          key={chicken.id}
          id={chicken.id}
          position={chicken.position}
        />
      ))}

      {/* Modal de victoria */}
      {currentScreen === 'victory' && <VictoryScreen />}
    </div>
  );
};

// Aplicar memo al componente Game completo
export default React.memo(Game);