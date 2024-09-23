import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoteDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  status?: string;
}
