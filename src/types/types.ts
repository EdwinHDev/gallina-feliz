// Posición en la pantalla
export interface Position {
  x: number;
  y: number;
}

// Estados posibles de un huevo
export type EggState = 'normal' | 'cracked' | 'hatching' | 'disappeared';


// Objeto huevo
export interface Egg {
  id: number;
  position: Position;
  state: EggState;
  createdAt: number;
  parentId: string;
  chickenId?: string; // ID del pollo que nacerá de este huevo
}

// Objeto pollo
export interface Chicken {
  id: string;
  position: Position;
}

// Estado para la animación del pollo
export interface ChickenAnimationState {
  isHatching: boolean;
  isJumping: boolean;
  hasLanded: boolean;
  isClucking: boolean;
  isWalking: boolean;
}