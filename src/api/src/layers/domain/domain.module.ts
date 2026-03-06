import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './services/user.service';
import { GameAiService } from './services/game-ai.serviсe';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, GameAiService],
  exports: [UserService, GameAiService],
})
export class DomainModule {}
