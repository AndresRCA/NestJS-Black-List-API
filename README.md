# Black List Service

## This service's function

This service receives phrases and tells the user whether they are stated as black listed or not. What constitutes a black listed word or phrase is whether they are a profanity. The user may also be able to add a new word to the black list.

> **IMPORTANT**: to establish a communication with this service, the client MUST add to his HTTP request headers the header "auth-token", the value should also be the same as the one defined at the .env file, otherwise your request WILL be rejected and a 403 status code will be returned.

## Installation

This project was built with `Node 18.12.1 LTS`, so keep that in mind as you host this service on a server.

To get this service up and running you have multiple choices, if you take a look at package.json there should be some scripts that should do the trick. First of all run `npm install` to install all dependencies.

1. `npm run build`: as the name says, it builds your code and outputs it under the dist/ directory.
2. `npm run dev`: runs your project on typescript with the help of `ts-node`, provides hot reloading.
3. `npm run start`: builds your project at `dist/` and starts your service.
> 4. `npm run test`: important to run before deploying your code, uses jest and supertest for unit testing and API endpoint testing

## Routes

This project may have more than one service, therefore there are as many base routes as many services there are. For example we have the Black List service, the base route for that service would be `/black_list` while the service's endpoints would be `/black_list/check_phrase`, `/black_list/add_profanity`, and so on...

### For Black List Service `/black_list`

* `POST '/check_phrase'`: receives phrases and tells the user whether they are stated as black listed or not. The body for this request should be `{ message: "your message to be checked" }` and the response to be expected should return this:
```typescript
{
  message: string,
  is_black_listed: boolean
}
```

* `POST '/add_profanity'`: receives words or phrases and adds them to the black list. The body for this request should be `{ new_word: "the word you want to add" }`
and the response to be expected should return this:
```typescript
{
  status: "OK" | "INVALID",
  message: "success or error message"
}
```
## Testing

Before deploying your changes to production, it is advised to first run `npm run test`, as doing so will tell you whether your code is viable for production. Of course it is recommended that collaborators that work on this project should also contribute by adding new tests for new features that would be worked upon, these new tests should be saved at the `__tests__` folder.

The structure of `__tests__` should mimic that of `src`, every file that has a class or a function should have their corresponding test file if it plays a vital role on the functionality of the project, that is how you mantain a healthy code base and collaborative working environment.

## Aditional notes

* If you so wish to manually add words to the black list, feel free to edit the `bad_word_list.json` under bad_words/. Also keep in mind this list does not contain all the words that will be black listed, the library `bad-words-es` holds it's own list of black listed words that are profanities, so `bad_word_list.json` is nothing more than an addition to that.
* If you'd like to add a new service to this project, define your service logic in the `services/` folder, your routes at `routes/`, and the functions you use for your routes at `controller/`. Ultimately the router object for your service should be exported to `app.ts` where the express server like so:
```typescript
// black list example
app.use('/black_list', black_list_routes)
```