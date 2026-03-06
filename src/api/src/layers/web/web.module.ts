import { Module } from '@nestjs/common';
import { WebController } from './controllers/web.controller';
import { GameWebMapper } from './mappers/game.web.mapper';
import { UserWebMapper } from './mappers/user.web.mapper';
import { BoardWebMapper } from './mappers/board.web.mapper';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [WebController],
  providers: [GameWebMapper, UserWebMapper, BoardWebMapper],
})
export class WebModule {}
