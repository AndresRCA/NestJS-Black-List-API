import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BlackListModule } from './black-list/black-list.module';
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // this module will not need to be imported in other places
      validationSchema: Joi.object({ // validate .env variables
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000)
      })
    }),
    BlackListModule
  ],
  controllers: [AppController]
})
export class AppModule {}
