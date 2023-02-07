import { Controller, Get } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@ApiSecurity('X-Auth-Key')
@Controller()
export class AppController {
  constructor() {}

  /**
   * Return description regarding the current version of the API.
   */
  @Get()
  @ApiOkResponse({ description: 'Message regarding API Version.', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  getRoot(): string {
    return 'API Version ' + process.env.API_VERSION
  }
}
