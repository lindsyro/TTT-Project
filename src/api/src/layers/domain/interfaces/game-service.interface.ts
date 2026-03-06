import { Board } from '../models/board.entity';
import { Game } from '../models/game.entity';
import { Coords } from '../types/game-state.types';

/**
 * Интерфейс сервиса
 */
export interface IGameService {
  /**
   * Метод получения следующего хода текущей игры алгоритмом Минимакс
   * @param currentGame Текущее состояние игры
   * @returns координаты хода
   */
  getNextMove(currentGame: Game): Promise<Coords | null>;

  /**
   * Метод валидации игрового поля текущей игры
   * @param currentGame Текущее состояние игры
   * @returns true, если поле валидно, иначе false
   */
  validateGameBoard(currentGame: Game): boolean;

  /**
   * Метод проверки окончания игры
   * @param board Игровое поле
   * @returns number | null
   */
  checkGameOver(board: Board): number | null;
}
