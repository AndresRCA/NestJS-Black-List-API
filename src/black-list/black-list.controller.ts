import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CheckPhraseDto } from './dto/black-list.dto';
import { BlackListService } from './services/black-list.service';

@Controller('black-list')
export class BlackListController {

  constructor(private blackListService: BlackListService) {}

  @Post('check-phrase')
  @HttpCode(200)
  checkPhrase(@Body() payload: CheckPhraseDto): { is_black_listed: boolean } {
    let msgIsProfane = this.blackListService.isBlackListed(payload.message)
    if (msgIsProfane) { 
      return { is_black_listed: true }
    } else {
      return { is_black_listed: false }
    }
  }

  @Post('add-profanity')
  async addProfanity(@Body('new_word') newWord: string) {
    if (!this.blackListService.isBlackListed(newWord)) { // if the new word is not profane, that means it's not on the list
      try {
        let successMsg = await this.blackListService.addNewProfanity(newWord)
        return { message: successMsg }
      } catch (error) {
        console.log(error)
        return { error: { message: 'There was a problem adding your word to our black list' } }
      }
    } else {
      return { error: { message: 'That word is already in the black list' } }
    }
  }
}
