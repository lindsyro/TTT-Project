import type { BoardDTO, Cell } from './models-types'

export class BoardModel {
  private readonly _field: Cell[][]

  constructor(data: BoardDTO) {
    this._field = data.field
  }

  get field() {
    return this._field
  }

  getValue(row: number, col: number): Cell {
    const value = this._field[row]?.[col]
    if (value === undefined) {
      throw new Error('Invalid coords')
    }
    return value
  }

  /**
   * Возвращает массив координат победной линии или null
   */
  get winningLine(): number[][] | null {
    const f = this._field

    const lines: [number, number][][] = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ]

    for (const line of lines) {
      const [a, b, c] = line

      if (!a || !b || !c) continue

      const v1 = f[a[0]]?.[a[1]]
      const v2 = f[b[0]]?.[b[1]]
      const v3 = f[c[0]]?.[c[1]]

      if (v1 !== 0 && v1 === v2 && v1 === v3) {
        return line
      }
    }
    return null
  }

  /**
   * Проверяет, является ли конкретная ячейка частью победной линии
   */
  isWinningCell(row: number, col: number): boolean {
    const line = this.winningLine
    if (!line) return false
    return line.some(([r, c]) => r === row && c === col)
  }
}
