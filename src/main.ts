require('dotenv').config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { AuthKeyGuard } from './guards/auth-key.guard'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  /*--- security middleware ---*/
  app.use(helmet())
  app.enableCors({ origin: '*' })
  /*---------------------------*/

  // check X-Auth-Key header for API key
  app.useGlobalGuards(new AuthKeyGuard())

  // employ nestjs request body validation using DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any extra properties from incoming payload
      forbidNonWhitelisted: true // forbid requests with incoming payload that don't follow a scheme (dto)
    })
  )

  // swagger documentation setup (for this project, API documentation should only be visible when developing...)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Generic NestJS API.')
      .addApiKey({ type: 'apiKey', name: 'X-Auth-Key', in: 'header' }, 'X-Auth-Key')
      .setVersion(process.env.API_VERSION as string)
      .build()

    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    }
    
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(process.env.PORT as unknown as number)
  console.log(`Application is running on: http://localhost:${process.env.PORT}`)
}
bootstrap()