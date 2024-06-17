import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AccessKey } from '../entities/access-key.entity';
import { RedisPubSubService } from '../redis/redis-pubsub.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  controllers: [AdminController],
  providers: [AdminService, RedisPubSubService],
})
export class AdminModule {}
