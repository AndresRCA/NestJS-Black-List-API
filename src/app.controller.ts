import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot(): string {
    return 'API Version ' + process.env.API_VERSION
  }
}
