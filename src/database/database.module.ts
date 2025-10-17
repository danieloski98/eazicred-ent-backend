import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const logger = new Logger('Database Module');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        onConnectionCreate: () => {
          logger.debug('Connected to database');
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
