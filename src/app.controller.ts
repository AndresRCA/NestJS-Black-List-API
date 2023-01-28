import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot(): string {
    return "API Version 2.0.0";
  }
}
