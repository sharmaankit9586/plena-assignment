import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('token-info')
export class TokenInfoController {
  constructor(private readonly tokenInfoService: TokenInfoService) {}

  @UseInterceptors(LoggingInterceptor)
  @Get()
  async getTokenInfo(@Query('key') key: string) {
    return await this.tokenInfoService.getTokenInfo(key);
  }
}
