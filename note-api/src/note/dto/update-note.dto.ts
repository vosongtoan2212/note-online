import { IsOptional } from 'class-validator';

export class UpdateNoteDTO {
  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  status: string;
}
