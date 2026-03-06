import { Injectable } from '@nestjs/common';
import { Coords } from '../types/game-state.types';
import { Game } from '../models/game.entity';

@Injectable()
export class GameAiService {
  public getBestMove(field: number[][]): Coords | null {
    const moves = this.getAvailableMoves(field);
    if (!moves.length) return null;

    let bestScore = Infinity;
    let bestMove = moves[0];

    for (const move of moves) {
      field[move.row][move.col] = 2;
      const score = this.minimax(field, 0, true);
      field[move.row][move.col] = 0;
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  private minimax(field: number[][], depth: number, isMax: boolean): number {
    const score = this.calculateScore(field);
    if (score !== null) return score;

    const moves = this.getAvailableMoves(field);
    if (isMax) {
      let best = -Infinity;
      for (const m of moves) {
        field[m.row][m.col] = 1;
        best = Math.max(best, this.minimax(field, depth + 1, false));
        field[m.row][m.col] = 0;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves) {
        field[m.row][m.col] = 2;
        best = Math.min(best, this.minimax(field, depth + 1, true));
        field[m.row][m.col] = 0;
      }
      return best;
    }
  }

  public calculateScore(field: number[][]): number | null {
    const lines = [
      ...field,
      [0, 1, 2].map(i => field[i][0]),
      [0, 1, 2].map(i => field[i][1]),
      [0, 1, 2].map(i => field[i][2]),
      [field[0][0], field[1][1], field[2][2]],
      [field[0][2], field[1][1], field[2][0]],
    ];

    for (const l of lines) {
      if (l.every(c => c === 1)) return 10;
      if (l.every(c => c === 2)) return -10;
    }
    return field.flat().every(c => c !== 0) ? 0 : null;
  }

  private getAvailableMoves(field: number[][]): Coords[] {
    return field
      .flatMap((row, r) =>
        row.map((cell, c) => (cell === 0 ? { row: r, col: c } : null)),
      )
      .filter((m): m is Coords => m !== null);
  }

  syncState(game: Game): void {
    const score = this.calculateScore(game.board.field);

    if (score === 10) return game.setWin(game.creator.user.uuid);
    if (score === -10 && game.opponent)
      return game.setWin(game.opponent.user.uuid);
    if (score === 0) return game.setDraw();
  }
}
