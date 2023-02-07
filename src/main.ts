import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { AuthKeyGuard } from './guards/auth-key/auth-key.guard'

require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  /*--- security middleware ---*/
  app.use(helmet())
  app.enableCors({ origin: '*' })
  /*---------------------------*/
  // check X-Auth-Key header for access key
  app.useGlobalGuards(new AuthKeyGuard())
  // employ nestjs validation for DTOs (used in controllers)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any extra properties from incoming payload
      forbidNonWhitelisted: true // forbid requests with incoming payload that don't follow a scheme (dto)
    })
  )

  await app.listen(process.env.PORT as unknown as number)
  console.log(`Application is running on: http://localhost:${process.env.PORT}`)
}
bootstrap()