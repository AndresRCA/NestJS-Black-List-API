import { IsNotEmpty, IsString } from "class-validator"

export class CheckPhraseDto {
  @IsString()
  @IsNotEmpty()
  message: string
}