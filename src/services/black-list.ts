import Filter from  'bad-words-es'
import { writeFile } from 'fs/promises'
const bad_words = require('../../bad_words/bad_word_list.json')

export class BlackList {
    private black_list: Array<string> = bad_words // add your personal list of words you want black listed here
    public filter // bad-words-es instance
    
    constructor() {
        this.filter = new Filter({ languages: ['es'], list: [...this.black_list] })
    }

    /**
     * update the list of profanities
     * @param new_word word to be added
     */
    public async add_new_profanity(new_word: string): Promise<string> {
        // update server side properties
        this.filter.addWords(new_word)
        this.black_list.push(new_word)

        // update json file
        let updatedList = JSON.stringify(this.black_list)
        try {
            await writeFile('./bad_words/bad_word_list.json', updatedList)
            return `word "${new_word}" was added successfully`
        } catch (error) {
            throw error
        }
    }
}