import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMapper } from 'src/layers/database/mappers/user.mapper';
import { UserDatasource } from 'src/layers/database/models/user.datasource';
import { UserRepository } from 'src/layers/database/repositories/user.repository';
import { UserService } from 'src/layers/domain/services/user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserDatasource])],
  providers: [UserService, UserRepository, UserMapper],
  exports: [UserService],
})
export class UsersModule {}
