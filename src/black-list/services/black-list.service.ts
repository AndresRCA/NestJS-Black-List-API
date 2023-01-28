import { Injectable } from '@nestjs/common';
import Filter from 'bad-words'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path';

@Injectable()
export class BlackListService {
  private blackList: Array<string> // = badWords // add your personal list of words you want black listed here
  private filter: Filter // bad-words instance
  
  constructor() {
    readFile(join(process.cwd(), './bad_words/bad_word_list.json'))
      .then((data) => {
        this.blackList = JSON.parse(data.toString())
        this.filter = new Filter({ emptyList: true, list: [...this.blackList] })
      })
      .catch(e => {
        console.log(e)
      })
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
      throw error
    }
  }
}
