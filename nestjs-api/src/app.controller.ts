import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthService } from './health.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    const [database, redis] = await Promise.all([
      this.healthService.checkDatabase(),
      this.healthService.checkRedis(),
    ]);
    return {
      status: database.ok && redis.ok ? 'ok' : 'degraded',
      database,
      redis,
      marker: 'zero-downtime-test-2-v3-bluegreen',
    };
  }
}
