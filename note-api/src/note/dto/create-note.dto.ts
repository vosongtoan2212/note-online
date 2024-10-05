import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
