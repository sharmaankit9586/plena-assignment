import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfoService } from './token-info.service';
import { TokenInfoController } from './token-info.controller';
import { AccessKey } from '../entities/access-key.entity';
import { RedisPubSubService } from '../redis/redis-pubsub.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  providers: [TokenInfoService, RedisPubSubService, RedisService],
  controllers: [TokenInfoController],
})
export class TokenInfoModule {}
