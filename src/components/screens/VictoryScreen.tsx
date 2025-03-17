import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import confetti from 'canvas-confetti';
import './VictoryScreen.css';

const VictoryScreen: React.FC = () => {
  const resetGame = useGameStore(state => state.resetGame);

  useEffect(() => {
    // Configurar el canvas para el confetti
    const myCanvas = document.createElement('canvas');
    myCanvas.id = 'confetti-canvas';
    document.body.appendChild(myCanvas);
    
    const myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true
    });

    // Función para crear una explosión de confetti
    const fireConfetti = () => {
      // Explosión central
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Cañones laterales
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        myConfetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        
        myConfetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Lanzar fuegos artificiales
      const launchFireworks = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        
        colors.forEach((color, index) => {
          setTimeout(() => {
            myConfetti({
              particleCount: 100,
              startVelocity: 30,
              spread: 360,
              ticks: 60,
              origin: { x: Math.random(), y: Math.random() * 0.5 + 0.3 },
              colors: [color]
            });
          }, index * 200);
        });
      };

      frame();
      launchFireworks();

      // Repetir los fuegos artificiales cada 2 segundos
      const fireworksInterval = setInterval(launchFireworks, 2000);

      return () => clearInterval(fireworksInterval);
    };

    // Iniciar la celebración
    const cleanup = fireConfetti();

    // Limpiar los intervalos y el canvas cuando se desmonte el componente
    return () => {
      if (cleanup) cleanup();
      document.body.removeChild(myCanvas);
    };
  }, []);

  return (
    <div className="victory-screen">
      <div className="victory-content">
        <h1>¡Felicidades! 🎉</h1>
        <p>Has logrado criar {useGameStore.getState().maxChickens} pollos</p>
        <button className="restart-button" onClick={resetGame}>
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen; 