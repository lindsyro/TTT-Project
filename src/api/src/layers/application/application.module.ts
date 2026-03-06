import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DomainModule } from '../domain/domain.module';
import { AuthService } from './auth.service';
import { GameService } from './game.service';

@Module({
  imports: [DomainModule, DatabaseModule],
  providers: [GameService, AuthService],
  exports: [GameService, AuthService],
})
export class ApplicationModule {}
