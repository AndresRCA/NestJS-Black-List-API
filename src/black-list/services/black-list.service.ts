import { Injectable } from '@nestjs/common'
import Filter from 'bad-words'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'

@Injectable()
export class BlackListService {
  private blackList: Array<string> // = badWords // add your personal list of words you want black listed here
  private filter: Filter // bad-words instance
  
  constructor() {
    let fileExists = existsSync('./bad_words/bad_word_list.json')
    this.blackList = fileExists ? require('../../../bad_words/bad_word_list.json') : []
    this.filter = new Filter({ emptyList: true }) // start with an empty list
    this.filter.addWords(...this.blackList) // populate the black list with your own bad_word_list.json
  }

  /**
   * Checks whether the word provided is black listed or not
   * @param word word to be tested
   * @returns whether the word provided is black listed or not
   */
  public isBlackListed(word: string): boolean {
    return this.filter.isProfane(word)
  }

  /**
   * update the list of profanities
   * @param newWord word to be added
   */
  public async addNewProfanity(newWord: string): Promise<string> {
    // update server side properties
    this.filter.addWords(newWord)
    this.blackList.push(newWord)

    // update json file
    let updatedList = JSON.stringify(this.blackList)
    try {
      await writeFile('./bad_words/bad_word_list.json', updatedList)
      return `word "${newWord}" was added successfully`
    } catch (error) {
      // undo changes done locally
      this.filter.removeWords(newWord)
      this.blackList.pop()
      throw error
    }
  }
}
