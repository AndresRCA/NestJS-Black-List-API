import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { AddProfanityDto } from '../dto/black-list.dto'
import { BadRequestBodyResponse, AddProfanityResponse, CheckPhraseResponse } from '../reponses/black-list.response'
import { BlackListService } from '../services/black-list.service'

@ApiTags('black-list')
@ApiSecurity('X-Auth-Key')
@Controller('black-list')
export class BlackListController {

  constructor(private blackListService: BlackListService) {}

  /**
   * Check whether a word is black listed or not.
   */
  @Get('check-phrase/:message')
  @ApiOkResponse({ type: CheckPhraseResponse })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  checkPhrase(@Param('message') message: string): CheckPhraseResponse {
    let msgIsProfane = this.blackListService.isBlackListed(message)
    return { is_black_listed: msgIsProfane }
  }

  /**
   * Add a word or phrase to the black list.
   */
  @Post('add-profanity')
  @ApiCreatedResponse({ type: AddProfanityResponse })
  @ApiBadRequestResponse({ description: 'Bad request.', type: BadRequestBodyResponse })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async addProfanity(@Body() payload: AddProfanityDto): Promise<AddProfanityResponse> {
    if (!this.blackListService.isBlackListed(payload.new_word)) { // if the new word is not profane, that means it's not on the list
      try {
        let successMsg = await this.blackListService.addNewProfanity(payload.new_word)
        return { message: successMsg, fulfilled: true }
      } catch (error) { // error should be of type Error
        throw new InternalServerErrorException('Internal server error', { cause: error, description: 'There was a problem adding your word to our black list' })
      }
    } else {
      return { message: 'That word is already in the black list', fulfilled: false }
    }
  }
}
