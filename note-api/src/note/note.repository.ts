import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NoteEntity } from '~/entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
  constructor(private dataSource: DataSource) {
    super(NoteEntity, dataSource.createEntityManager());
  }

  async firstWhere(column: string, value: string | number, operator = '=') {
    return await this.createQueryBuilder()
      .where(`${column} ${operator} :value`, { value })
      .getOne();
  }
}
