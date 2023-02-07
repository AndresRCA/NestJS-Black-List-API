export class CheckPhraseResponse {
  is_black_listed: boolean
}

export class AddProfanityResponse {
  /**
   * Message regarding the outcome of the request
   * @example 'word "****" was added successfully'
   */
  message: string

  /**
   * Answers the question of whether the word was succesfully added or not
   */
  fulfilled: boolean
}