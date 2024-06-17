import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfoModule } from './token-info/token-info.module';
import { AccessKey } from './entities/access-key.entity';
import { RedisPubSubService } from './redis/redis-pubsub.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'access-keys.db',
      entities: [AccessKey],
      synchronize: true,
    }),
    TokenInfoModule,
  ],
  providers: [RedisPubSubService],
})
export class AppModule {}
