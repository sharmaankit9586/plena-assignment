import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AccessKey } from './entities/access-key.entity';
import { RedisPubSubService } from './redis/redis-pubsub.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'access-keys.db',
      entities: [AccessKey],
      synchronize: true,
    }),
    AdminModule,
    UserModule,
  ],
  providers: [RedisPubSubService],
})
export class AppModule {}
