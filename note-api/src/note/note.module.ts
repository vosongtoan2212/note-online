import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteRepository } from '~/note/note.repository';
import { NoteController } from '~/note/note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from '~/entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  providers: [NoteService, NoteRepository],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}
