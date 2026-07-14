import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  private readonly redis = new Redis(process.env.REDIS_URL ?? '', {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async checkDatabase(): Promise<{ ok: boolean; error?: string }> {
    try {
      await this.dataSource.query('SELECT 1');
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }

  async checkRedis(): Promise<{ ok: boolean; error?: string }> {
    try {
      if (this.redis.status === 'wait') {
        await this.redis.connect();
      }
      await this.redis.ping();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }
}
