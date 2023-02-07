import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { BlackListModule } from './black-list/black-list.module';

@Module({
  imports: [
    BlackListModule,
    ThrottlerModule.forRoot({
      ttl: 15 * 60, // 15 minutes seconds
      limit: 100, // 100 max requests per 15 minutes
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // bind the ThrottlerGuard globally (for the moment)
    }
  ],
  controllers: [AppController]
})
export class AppModule {}
