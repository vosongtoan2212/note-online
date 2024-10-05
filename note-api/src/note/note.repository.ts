import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NoteEntity } from '~/entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
  constructor(private dataSource: DataSource) {
    super(NoteEntity, dataSource.createEntityManager());
  }
}
