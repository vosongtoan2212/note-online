import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PayloadRO } from '~/base/ro/payload.ro';
import { NoteEntity } from '~/entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<NoteEntity> {
  constructor(private dataSource: DataSource) {
    super(NoteEntity, dataSource.createEntityManager());
  }

  async buildQueryGetInTrash(payloadToken: PayloadRO) {
    return this.createQueryBuilder('note')
      .andWhere('note.userId = :userId', { userId: payloadToken.sub })
      .andWhere('note.status = 0')
      .andWhere('note.deletedAt IS NOT NULL')
      .withDeleted();
  }

  async getListInTrash(payloadToken: PayloadRO): Promise<NoteEntity[]> {
    const query = await this.buildQueryGetInTrash(payloadToken);
    return query.getMany();
  }

  async getOneInTrash(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    const query = await this.buildQueryGetInTrash(payloadToken);
    return query.andWhere('note.id = :id', { id }).getOne();
  }
}
