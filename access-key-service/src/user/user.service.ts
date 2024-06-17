import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from '../entities/access-key.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AccessKey)
    private readonly accessKeyRepository: Repository<AccessKey>,
  ) {}

  async getKeyDetails(key: string): Promise<AccessKey> {
    const accessKey = await this.accessKeyRepository.findOneBy({ key });
    if (!accessKey) {
      throw new NotFoundException('Access key not found');
    }
    return accessKey;
  }

  async disableKey(key: string): Promise<void> {
    const accessKey = await this.accessKeyRepository.findOneBy({ key });


    if (!accessKey) {
      throw new NotFoundException('Access key not found');
    }

    await this.accessKeyRepository.update({ key }, { isActive: false });
  }
}
