import { IsNotEmpty, IsString } from "class-validator"

export class AddProfanityDto {
  @IsString()
  @IsNotEmpty()
  new_word: string
}