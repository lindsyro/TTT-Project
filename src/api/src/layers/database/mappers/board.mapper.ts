import { Board } from 'src/layers/domain/models/board.entity';
import { BoardDatasource } from '../models/board.datasource';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardMapper {
  toDatasource(domainBoard: Board): BoardDatasource {
    return {
      field: domainBoard.field,
    };
  }

  toDomain(datasourceBoard: BoardDatasource): Board {
    return new Board(datasourceBoard.field);
  }
}
