/**
 * Модель игрового поля в виде целочисленной матрицы
 */
export class Board {
  /** Игровое поле: 0 — пусто, 1 — крестик, 2 — нолик */
  public field: number[][];

  constructor(source: number | number[][]) {
    if (Array.isArray(source)) {
      this.field = source;
    } else {
      this.field = Array.from({ length: source }, () => Array(source).fill(0));
    }
  }

  /**
   * Проверяет, заполнено ли игровое поле полностью
   * @returns true, если свободных ячеек (0) больше нет
   */
  isFull(): boolean {
    return this.field.every(row => row.every(cell => cell !== 0));
  }

  /**
   * Устанавливает значение в ячейку
   */
  setMove(row: number, col: number, value: 1 | 2): void {
    if (!this.field[row] || this.field[row][col] === undefined) {
      throw new Error('Координаты вне диапазона игрового поля');
    }

    if (this.field[row][col] !== 0) {
      throw new Error('Ячейка уже занята');
    }

    this.field[row][col] = value;
  }
}
