import { Controller, Post, Delete, Put, Get, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateKeyDto } from '../dto/create-key.dto';
import { UpdateKeyDto } from '../dto/update-key.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('keys')
  async createKey(@Body() createKeyDto: CreateKeyDto) {
    return this.adminService.createKey(createKeyDto);
  }

  @Delete('keys/:id')
  async deleteKey(@Param('id') id: string) {
    return this.adminService.deleteKey(id);
  }

  @Put('keys/:id')
  async updateKey(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.adminService.updateKey(id, updateKeyDto);
  }

  @Get('keys')
  async listKeys() {
    return this.adminService.listKeys();
  }
}
