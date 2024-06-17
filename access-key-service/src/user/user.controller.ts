import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('keys/:key')
  async getKeyDetails(@Param('key') key: string) {
    return this.userService.getKeyDetails(key);
  }

  @Patch('keys/:key/disable')
  async disableKey(@Param('key') key: string) {
    return this.userService.disableKey(key);
  }
}
