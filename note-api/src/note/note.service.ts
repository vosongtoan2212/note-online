import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Not } from 'typeorm';
import { PayloadRO } from '~/base/ro/payload.ro';
import { CustomResponse, formatResponse } from '~/base/utils/response.util';
import { NoteEntity } from '~/entities/note.entity';
import { CreateNoteDTO } from '~/note/dto/create-note.dto';
import { UpdateNoteDTO } from '~/note/dto/update-note.dto';
import { NoteRepository } from '~/note/note.repository';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async findOne(id: number, payloadToken: PayloadRO): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({
      where: {
        id,
        userId: payloadToken.sub,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async findOneInTrash(
    id: number,
    payloadToken: PayloadRO,
  ): Promise<NoteEntity> {
    const note = await this.noteRepository.findOne({
      where: { id: id, userId: payloadToken.sub, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found in trash`);
    }
    return note;
  }

  async getListNotes(req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    try {
      const notes = await this.noteRepository.find({
        where: {
          userId: payloadToken.sub,
        },
      });
      if (!notes) {
        throw new NotFoundException(`Note is empty`);
      }
      return formatResponse(HttpStatus.OK, 'Notes fetched successfully', notes);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListNotesInTrash(req: any): Promise<CustomResponse> {
    const payloadToken = req.user;

    try {
      const notes = await this.noteRepository.find({
        where: { userId: payloadToken.sub, deletedAt: Not(IsNull()) },
        withDeleted: true,
      });

      if (!notes) {
        throw new NotFoundException(`Trash is empty`);
      }

      return formatResponse(
        HttpStatus.OK,
        'Notes in trash fetched successfully',
        notes,
      );
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNoteById(id: number, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    const note = await this.findOne(id, payloadToken);
    return formatResponse(HttpStatus.OK, 'Note fetched successfully', note);
  }

  async getNoteInTrashById(id: number, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    try {
      const note = await this.findOneInTrash(id, payloadToken);
      return formatResponse(HttpStatus.OK, 'Notes fetched successfully', note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNote(data: CreateNoteDTO, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    const newNote = this.noteRepository.create({
      ...data,
      userId: payloadToken.sub,
    });
    try {
      await this.noteRepository.save(newNote);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return formatResponse(HttpStatus.OK, 'Note create successfully', newNote);
  }

  async updateNote(
    id: number,
    data: UpdateNoteDTO,
    req: any,
  ): Promise<CustomResponse> {
    // Tìm ghi chú theo id và người dùng
    const payloadToken = req.user;
    let note = await this.findOne(id, payloadToken);
    note = { ...note, ...data };
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

    return formatResponse(HttpStatus.OK, 'Note update successfully', note);
  }

  async addToTrashNote(id: number, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    // Tìm ghi chú theo id và người dùng
    const note = await this.findOne(id, payloadToken);

    try {
      await this.noteRepository.softRemove(note);
    } catch (e) {
      throw new HttpException(
        {
          errorCode: 'ERROR.INTERNAL_SERVER_ERROR',
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return formatResponse(
      HttpStatus.OK,
      'Note add to trash successfully',
      note,
    );
  }

  async restoreFromTrash(id: number, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    // Tìm ghi chú theo id và người dùng
    const note = await this.findOneInTrash(id, payloadToken);
    note.deletedAt = null;

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

    return formatResponse(HttpStatus.OK, 'Note restore successfully', note);
  }

  async deleteNotePermanently(id: number, req: any): Promise<CustomResponse> {
    const payloadToken = req.user;
    // Tìm ghi chú theo id và người dùng
    const note = await this.findOneInTrash(id, payloadToken);
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
    return formatResponse(HttpStatus.OK, 'Note delete successfully', note);
  }
}
