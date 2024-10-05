import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}
