/**
 * Статус игры
 */
export enum GameStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  DRAW = 'DRAW',
  WON = 'WON',
}

/**
 * Состояние игры
 */
export type GameState =
  | { status: GameStatus.WAITING } // Ожидание игроков
  | { status: GameStatus.PLAYING; playerUUID: string } // Ход игрока с UUID
  | { status: GameStatus.DRAW } // Ничья
  | { status: GameStatus.WON; playerUUID: string };

/**
 * Тип координат следующего хода
 */
export type Coords = {
  row: number;
  col: number;
};

/**
 * Тип хода
 */
export type Move = {
  coords: Coords;
  player: number;
};
