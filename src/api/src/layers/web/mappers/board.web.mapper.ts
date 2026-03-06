import { Board } from 'src/layers/domain/models/board.entity';
import { BoardWeb } from '../models/board.web';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardWebMapper {
  toWeb(domainBoard: Board): BoardWeb {
    return {
      field: domainBoard.field,
    };
  }
}
