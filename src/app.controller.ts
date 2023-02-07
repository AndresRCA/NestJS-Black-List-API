import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@ApiHeader({
  name: 'X-Auth-Key',
  description: 'Header used for key authorization'
})
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot(): string {
    return 'API Version ' + process.env.API_VERSION
  }
}
