import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './layers/database/database.module';
import { DomainModule } from './layers/domain/domain.module';
import { ApplicationModule } from './layers/application/application.module';
import { WebModule } from './layers/web/web.module';
import databaseConfig from './layers/database/config/database.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = configService.get('database');
        if (!options) {
          throw new Error(
            'Config "database" is undefined! Check registerAs name.',
          );
        }
        return options;
      },
    }),
    AuthModule,
    WebModule,
    DatabaseModule,
    DomainModule,
    ApplicationModule,
    WebModule,
  ],
})
export class AppModule {}
