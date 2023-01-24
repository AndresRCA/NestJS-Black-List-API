# Black List Service

## This service's function

This service receives phrases and tells the user whether they are stated as black listed or not. What constitutes a black listed word or phrase is whether they are a profanity. The user may also be able to add a new word to be black list from a HTTP POST request.

> **IMPORTANT**: to establish a communication with this service, the client MUST add to his HTTP request headers the key "auth-token", the value should also be the same as the one defined at the .env file, otherwise your request WILL be rejected and a 403 status code will be returned.

## Installation

To get this service up and running you have multiple choices, if you take a look at package.json there should be some scripts that should do the trick. First of all run `npm install` to install all dependencies.

1. `npm run build`: as the name says, it builds your code and outputs it under the dist/ directory.
2. `npm run dev`: just your regular script for running your service while developing it, provides hot reloading.
3. `npm run start`: should be executed after `npm run build` or `npm run dev` in order to start your service.

## Routes

* `POST: '/check_phrase'`: receives phrases and tells the user whether they are stated as black listed or not. The body for this request should be `{ message: "your message to be checked" }` and the response to be expected should return this `{ message: string, is_black_listed: boolean }`.

* `POST: '/add_profanity'`: receives words or phrases and adds them to the black list. The body for this request should be `{ new_word: "the word you want to add" }` and the response to be expected should return this `{ status: "OK" | "INVALID", message: "success or error message" }`.

### Aditional notes

If you so wish to manually add words to the black list, feel free to edit the `bad_word_list.json` under bad_words/.