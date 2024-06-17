import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from '../entities/access-key.entity';
import { CreateKeyDto } from '../dto/create-key.dto';
import { UpdateKeyDto } from '../dto/update-key.dto';
import { RedisPubSubService } from '../redis/redis-pubsub.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AccessKey)
    private readonly accessKeyRepository: Repository<AccessKey>,
    private readonly redisPubSubService: RedisPubSubService,
  ) { }

  async createKey(createKeyDto: CreateKeyDto): Promise<AccessKey> {
    const key = new AccessKey();
    key.key = this.generateKey();
    key.rateLimit = createKeyDto.rateLimit;
    key.expiration = createKeyDto.expiration;
    key.userId = createKeyDto.userId;
    const savedKey = await this.accessKeyRepository.save(key);
    await this.redisPubSubService.publish('access-key-events', JSON.stringify({ action: 'create', key: savedKey }));
    return savedKey;
  }

  async deleteKey(id: string): Promise<void> {
    await this.accessKeyRepository.delete(id);
    await this.redisPubSubService.publish('access-key-events', JSON.stringify({ action: 'delete', key: { id } }));
  }

  async updateKey(id: string, updateKeyDto: UpdateKeyDto): Promise<AccessKey> {
    await this.accessKeyRepository.update(id, updateKeyDto);
    const updatedKey = await this.accessKeyRepository.findOne({ where: { id } });
    await this.redisPubSubService.publish('access-key-events', JSON.stringify({ action: 'update', key: updatedKey }));
    return updatedKey;
  }

  async listKeys(): Promise<AccessKey[]> {
    return this.accessKeyRepository.find();
  }

  private generateKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
