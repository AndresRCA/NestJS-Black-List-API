import { Body, Controller, Post } from '@nestjs/common';
import { BlackListService } from './services/black-list.service';

@Controller('black-list')
export class BlackListController {

  constructor(private blackListService: BlackListService) {}

  @Post('check-phrase')
  check_phrase(@Body('message') message: string) {
    let msg_is_profane = this.blackListService.isBlackListed(message)
    if (msg_is_profane) { 
      return { is_black_listed: true }
    } else {
      return { is_black_listed: false }
    }
  }

  @Post('add-profanity')
  addProfanity(@Body('new_word') newWord: string) {
    if (!this.blackListService.isBlackListed(newWord)) { // if the new word is not profane, that means it's not on the list
      this.blackListService.addNewProfanity(newWord)
        .then((success_msg: string) => {
          return { message: success_msg }
        })
        .catch((e) => {
          console.log(e)
          return { error: { message: 'There was a problem adding your word to our black list' } }
        })
    } else {
      return { error: { message: 'That word is already in the black list' } }
    }
  }
}
