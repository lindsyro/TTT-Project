import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoardMapper } from './mappers/board.mapper';
import { GameMapper } from './mappers/game.mapper';
import { UserMapper } from './mappers/user.mapper';
import { GameDatasource } from './models/game.datasource';
import { UserDatasource } from './models/user.datasource';
import { GameRepository } from './repositories/game.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserDatasource, GameDatasource])],
  providers: [
    UserRepository,
    GameRepository,
    UserMapper,
    GameMapper,
    BoardMapper,
  ],
  exports: [UserRepository, GameRepository],
})
export class DatabaseModule {}
