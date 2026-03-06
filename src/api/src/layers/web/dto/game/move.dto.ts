import { IsInt, Min, Max } from 'class-validator';

export class MoveDto {
  @IsInt({ message: 'Строка должна быть целым числом' })
  @Min(0)
  @Max(2)
  row: number;

  @IsInt({ message: 'Колонка должна быть целым числом' })
  @Min(0)
  @Max(2)
  col: number;
}
