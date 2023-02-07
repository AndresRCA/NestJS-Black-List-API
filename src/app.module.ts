import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { BlackListModule } from './black-list/black-list.module';

@Module({
  imports: [
    BlackListModule,
    ThrottlerModule.forRoot({
      ttl: 60, // 60 seconds
      limit: 20, // 20 requests per 60 seconds
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
