import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  /*--- security middleware ---*/
  app.use(helmet())
  app.enableCors()
  /*---------------------------*/
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any extra properties from incoming payload
      forbidNonWhitelisted: true // forbid requests with incoming payload that don't follow a scheme (dto)
    })
  )
  await app.listen(process.env.PORT as unknown as number)
}
bootstrap()