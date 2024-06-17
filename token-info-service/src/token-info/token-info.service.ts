import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisPubSubService } from '../redis/redis-pubsub.service';
import { AccessKey } from '../entities/access-key.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TokenInfoService implements OnModuleInit {
    private readonly tokenInfo = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_data: {
            current_price: {
                usd: 50000,
            },
            market_cap: {
                usd: 1000000000,
            },
            total_volume: {
                usd: 100000000,
            },
        },
    };

    constructor(
        @InjectRepository(AccessKey)
        private readonly accessKeyRepository: Repository<AccessKey>,
        private readonly redisPubSubService: RedisPubSubService,
        private readonly redisService: RedisService,
    ) { }

    async onModuleInit() {
        await this.redisPubSubService.subscribe('access-key-events', async (message: string) => {
            const { action, key } = JSON.parse(message);
            switch (action) {
                case 'create':
                case 'update':
                    await this.accessKeyRepository.save(key);
                    break;
                case 'delete':
                    await this.accessKeyRepository.delete({ id: key.id });
                    break;
                case 'disable':
                    await this.accessKeyRepository.update({ id: key.id }, { isActive: false });
                    break;
            }
        });
    }

    async checkRateLimitByKey(key: string, limit: number) {
        const redisKey = `rate_limit:${key}`;
        const requestsCount = await this.redisService.getClient().get(redisKey);
        if (requestsCount && parseInt(requestsCount, 10) >= limit) {
            return false;
        }
        await this.redisService.getClient().incr(redisKey);
        await this.redisService.getClient().expire(redisKey, 60);
        return true;
    }

    async validateKeyAndRateLimit(key: string): Promise<AccessKey> {
        const accessKey = await this.accessKeyRepository.findOne({ where: { key, isActive: true } });
        if (!accessKey) {
            throw new NotFoundException(`Access key not found or inactive`);
        }
        const currentTime = new Date();
        if (accessKey.expiration < currentTime) {
            throw new BadRequestException(`Access key has expired`);
        }
        const isAllowed = await this.checkRateLimitByKey(`user-info-${accessKey.id}`, accessKey.rateLimit)
        if (!isAllowed) {
            throw new BadRequestException(`Rate limit exceeded. Please try again later.`);
        }
        return accessKey;
    }

    async getTokenInfo(key: string): Promise<any> {
        await this.validateKeyAndRateLimit(key);

        return this.tokenInfo;
    }
}
