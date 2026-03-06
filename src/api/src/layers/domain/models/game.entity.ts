import { v4 as uuidv4 } from 'uuid';
import { Board } from './board.entity';
import { User } from './user.entity';
import { GameState, GameStatus } from '../types/game-state.types';
import { GamePlayer } from './game-player.value-object';

/**
 * Модель текущей игры, у которой есть UUID и игровое поле
 */
export class Game {
  /**
   * Уникальный идентификатор игры
   */
  public readonly uuid: string;

  /**
   * Игровое поле
   */
  public board: Board;

  /**
   * Авторизованный пользователь
   */
  public creator: GamePlayer;

  /**
   * Второй игрок
   */
  public opponent: GamePlayer | null;

  /**
   * Состояние игры
   */
  public state: GameState;

  constructor(uuid: string, board: Board, creator: User) {
    this.uuid = uuid;
    this.board = board;
    this.creator = {
      user: creator,
      icon: 'X',
    };
    this.opponent = null;
    this.state = { status: GameStatus.WAITING };
  }

  /**
   * Статический метод для создания новой игры
   * @returns возвращает экземпляр игры
   */
  static create(user: User): Game {
    const uuid = uuidv4();
    const board = new Board(3);

    return new Game(uuid, board, user);
  }

  /**
   * Метод для присоединения второго игрока и запуска игры
   */
  setOpponent(user: User) {
    if (this.creator.user.uuid === user.uuid) {
      throw new Error('Нельзя играть с самим собой');
    }

    this.opponent = {
      user: user,
      icon: 'O',
    };

    this.state = {
      status: GameStatus.PLAYING,
      playerUUID: this.creator.user.uuid,
    };
  }

  /**
   * Метод для установки хода игрока
   */
  switchTurn() {
    if (this.state.status === GameStatus.PLAYING) {
      const nextPlayerId =
        this.state.playerUUID === this.creator.user.uuid
          ? this.opponent?.user.uuid
          : this.creator.user.uuid;

      if (!nextPlayerId) {
        throw new Error('Невозможно переключить ход: оппонент не найден');
      }

      this.state = {
        status: GameStatus.PLAYING,
        playerUUID: nextPlayerId,
      };
    }
  }

  /**
   * Метод для установки состояния ничьей
   */
  setDraw() {
    this.state = { status: GameStatus.DRAW };
  }

  /**
   * Метод для установки победы игрока
   */
  setWin(playerUUID: string) {
    this.state = { status: GameStatus.WON, playerUUID };
  }
}
