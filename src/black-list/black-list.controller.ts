import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, Post, Res } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AddProfanityDto } from './dto/black-list.dto';
import { BlackListService } from './services/black-list.service';

@ApiTags('black-list')
@ApiHeader({
  name: 'X-Auth-Key',
  description: 'Header used for key authorization'
})
@Controller('black-list')
export class BlackListController {

  constructor(private blackListService: BlackListService) {}

  /**
   * Check whether a word is black listed or not
   */
  @Get('check-phrase/:message')
  checkPhrase(@Param('message') message: string): { is_black_listed: boolean } {
    let msgIsProfane = this.blackListService.isBlackListed(message)
    return { is_black_listed: msgIsProfane }
  }

  /**
   * Add a word or phrase to the black list
   */
  @Post('add-profanity')
  async addProfanity(@Res() res: Response, @Body() payload: AddProfanityDto) {
    if (!this.blackListService.isBlackListed(payload.new_word)) { // if the new word is not profane, that means it's not on the list
      try {
        let successMsg = await this.blackListService.addNewProfanity(payload.new_word)
        res.json({ message: successMsg, fulfilled: true })
      } catch (error) { // error should be type Error
        throw new InternalServerErrorException('Internal server error', { cause: error, description: 'There was a problem adding your word to our black list' })
      }
    } else {
      res.json({ message: 'That word is already in the black list', fulfilled: false })
    }
  }
}
