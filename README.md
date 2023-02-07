# Black List Service

## This service's function

This service receives phrases and tells the user whether they are stated as black listed or not. What constitutes a black listed word or phrase is whether they are a profanity or not. The user may also be able to add new words to the black list.

> **IMPORTANT**: To establish a communication with this service, the client MUST add to his HTTP request headers the header `X-Auth-Key`, the value should also be the same as the one defined in the `.env` file, otherwise your request WILL be rejected with a 403 status code.

## Installation

This project was built with `Node 18.12.1 LTS`, so keep that in mind as you host this service on a server. The following are steps to take in order to have a functioning application.

1. Run `npm install` to install all dependencies.
2. Rename your files so they don't have `.example` as a suffix (`.env.example`, `bad_words/bad_word_list.json.example`, etc...).
3. If you have your own list of profanities you'd like to include, make sure to import your own `bad_word_list.json` for the black list service to use, or not (either way bad_words folder must exist).
    > By default the black list starts off empty, so unless you add your own list there won't be any black listed phrase in storage.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Routes (Sample)

This project may have more than one service, therefore there are as many base routes as many services there are. For example we have the Black List service, the base route for that service would be `/black-list` while the service's endpoints would be `/black-list/check-phrase`, `/black-list/add-profanity`, and so on...

> Take into account that the server responses defined in the tables below refer to Successful responses (http status code 200 – 299), it is what one would call the "expected" response. Responses other than that such as errors will not be documented here as the nature of such responses varies depending on the case.

For a more detailed documentation be sure to check the API documentation created using [swagger](https://docs.nestjs.com/openapi/introduction) at the `/docs` route.

### For Black List Service `base_route='/black-list'`

<table>
<tr>
<td>Route</td>
<td>User Request</td>
<td>Server Response</td>
</tr>
<tr>
<td>

`GET /check-phrase/:message`: receives phrases and tells the client whether they are black listed or not.
</td>
<td>
Param request
</td>
<td>

```typescript
{  
  is_black_listed: boolean
}
```
</td>
</tr>
<tr>
<td>

`POST /add-profanity`: receives words or phrases and adds them to the black list.
</td>
<td>

```typescript
{
  new_word: string
}
```
</td>
<td>

```typescript
// success
{
  message: string,
  fulfilled: true
}

// unfulfilled request (could not add a new word)
{
  message: string,
  fulfilled: false
}
```
</td>
</tr>
</table>

## Development policies

If you'd like to collaborate on this project, there are some **policies** that I would **appreciate** if you follow through.

1. **Documentation**: Currently the way this project maintains it's documentation is through the use of [swagger](https://docs.nestjs.com/openapi/introduction) in NestJS. You can find documentation regarding API calls and their responses at the `/docs` route. If you're working on a new controller or expanding on an existing one, **please** follow the guide regarding [swagger](https://docs.nestjs.com/openapi/introduction) in order to mantain a **healthy codebase** and **collaborative environment**. At the moment `/docs` is only created when `typescriptprocess.env.NODE_ENV !== 'production'` so basically it only exists for developers that work on this API, it's not meant to be public.

    This is how a documented request would look like:

    ![swagger example](/docs/swaggerExample.png)

    > Requests that require an API key are protected, you can authorize all requests when clicking the lock on the top right corner of `/docs` and then entering your key value.

    Lastly, remember that whatever type you pass to the `@ApiResponse` decorator should always be reflected by what your route handler returns, like so:

    ```typescript
    @Get('check-phrase/:message')
    @ApiOkResponse({ type: CheckPhraseResponse })
    checkPhrase(@Param('message') message: string): CheckPhraseResponse {
      // ...
      return { is_black_listed: msgIsProfane }
    }
    ```

2. **Folder structure**: When in doubt about where you should store your files, please follow the example set by the `black-list` directory, here is a breakdown of each subdirectory and what they should store.
    * **controller**: [Controller](https://docs.nestjs.com/controllers) files.
    * **services**: [Providers](https://docs.nestjs.com/fundamentals/custom-providers) used in your NestJS app.
    * **dto**: Classes that are used in request body validations, as NestJS [suggests](https://docs.nestjs.com/techniques/validation#mapped-types).
    * **responses (NestJS non-standard)**: Classes that are used for [documenting](https://docs.nestjs.com/openapi/operations#responses) and defining the type of response a route should return. In order for swagger to detect these files that possess a suffix of `.response.ts` a new value was added to `"dtoFileNameSuffix"` inside the `nest-cli.json` file.

3. **Testing**: If you're working on a new module or adding some new functionality to the project, creating test files is by no means obligatory, **however**, if you're working on existing code which already has a test file with tests that are defined, it is your **responsibility** to mantain those tests if the objective of your work is to update or change the logic of what is being tested.

## Aditional notes

* When sending HTTP errors to the client, for a standard response among all routes please use NestJS built-in [exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions). For example:
  ```typescript
  // server side
  throw new BadRequestException('Bad request error', { cause: new Error(), description: 'Some error description' })

  // what the client receives
  {
    "message": "Bad request error",
    "error": "Some error description",
    "statusCode": 400,
  }
  ```

* Regarding the `cause` option property and the `Error` object, an error generated by the system should be of type `Error`, so the following should be acceptable:

  ```typescript
  // DatabaseService.service.ts
  async function find(id: number): Promise<Item> {
    let item = await this.db.execute('...', [id])
    return item
  }

  // item.controller.ts
  @Get(':id')
  example(@Param('id', ParseIntPipe) id: number) {
    try {
      let item = await this.databaseService.find(id)
      return item
    } catch (error) { // error should be of type Error
      throw new InternalServerErrorException('Internal server error', { cause: error, description: 'There was a problem finding an item with id=' + id })
    }
  }
  ```