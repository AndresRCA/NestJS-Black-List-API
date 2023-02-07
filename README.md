# Black List Service

## This service's function

This service receives phrases and tells the user whether they are stated as black listed or not. What constitutes a black listed word or phrase is whether they are a profanity or not. The user may also be able to add new words to the black list.

> **IMPORTANT**: to establish a communication with this service, the client MUST add to his HTTP request headers the header "X-Auth-Key", the value should also be the same as the one defined in the `.env` file, otherwise your request WILL be rejected with a 401 status code.

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

## Routes

This project may have more than one service, therefore there are as many base routes as many services there are. For example we have the Black List service, the base route for that service would be `/black-list` while the service's endpoints would be `/black-list/check-phrase`, `/black-list/add-profanity`, and so on...

> Take into account that the server responses defined in the tables below refer to Successful responses (http status code 200 – 299), it is what one would call the "expected" response. Responses other than that such as errors will not be documented here as the nature of such responses varies depending on the case.

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

## Aditional notes

* When sending HTTP errors to the client, for a standard response among all routes please use Nestjs built-in [exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions). For example:
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

* Regarding the cause option property and the Error object, when aware of the error you can expect to receive (native system errors), you can pass that error over to the cause property of the Nestjs exceptions, like so:
```typescript
// DatabaseService.service.ts
async function find(id: number): Promise<Item> {
  try {
    let item = await this.db.execute('...', [id])
    return item
  } catch (error) {
    throw error
  }
}

// item.controller.ts
@Get(':id')
example(@Param('id', ParseIntPipe) id: number) {
  try {
    let item = await this.databaseService.find(id)
    return item
  } catch (error) { // error is as type Error by this.dbService.find()
    throw new InternalServerErrorException('Internal server error', { cause: error, description: 'There was a problem finding an item with id=' + id })
  }
}
```