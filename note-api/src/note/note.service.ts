import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayloadRO } from '~/base/ro/payload.ro';
import { NoteEntity } from '~/entities/note.entity';
import { CreateNoteDTO } from '~/note/dto/create-note.dto';
import { UpdateNoteDTO } from '~/note/dto/update-note.dto';
import { NoteRepository } from '~/note/note.repository';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async getListNotes(payloadToken: PayloadRO): Promise<NoteEntity[]> {
    return this.noteRepository.find({
      where: {
        userId: { id: payloadToken.sub },
      },
    });
  }

  async getNoteById(id: number, payloadToken: PayloadRO): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({
      where: {
        id,
        userId: { id: payloadToken.sub },
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async getNoteInTrashById(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    // Sử dụng QueryBuilder và thêm `withDeleted()` để lấy các bản ghi bị soft delete
    const note = await this.noteRepository
      .createQueryBuilder('note')
      .where('note.id = :id', { id })
      .andWhere('note.userId = :userId', { userId: payloadToken.sub })
      .andWhere('note.status = 0')
      .andWhere('note.deletedAt IS NOT NULL')
      .withDeleted()
      .getOne();

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found in trash`);
    }

    return note;
  }

  async createNote(
    data: CreateNoteDTO,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    const { sub } = payloadToken;
    const newNote = this.noteRepository.create({
      ...data,
      userId: { id: sub },
    });
    return await this.noteRepository.save(newNote);
  }

  async updateNote(
    id: number,
    data: UpdateNoteDTO,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    // Tìm ghi chú theo id và người dùng
    const note = await this.getNoteById(id, payloadToken);

    // Cập nhật giá trị cho ghi chú
    Object.assign(note, data);

    try {
      await this.noteRepository.save(note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return note;
  }

  async addToTrashNote(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    // Tìm ghi chú theo id và người dùng
    const note = await this.getNoteById(id, payloadToken);

    const data = {
      deletedAt: new Date(),
      status: 0,
    };
    // Cập nhật giá trị cho ghi chú
    Object.assign(note, data);

    try {
      await this.noteRepository.save(note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return note;
  }

  async removeFromTrashNote(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    // Tìm ghi chú theo id và người dùng
    const note = await this.getNoteInTrashById(id, payloadToken);

    const data = {
      deletedAt: null,
      status: 1,
    };
    // Cập nhật giá trị cho ghi chú
    Object.assign(note, data);

    try {
      await this.noteRepository.save(note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return note;
  }

  async deleteNotePermanently(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<object> {
    // Tìm ghi chú theo id và người dùng
    const note = await this.getNoteInTrashById(id, payloadToken);
    try {
      await this.noteRepository.remove(note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Note deleted' };
  }
}
