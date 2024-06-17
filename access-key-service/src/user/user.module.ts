import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessKey } from '../entities/access-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
