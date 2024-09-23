import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Payload } from '~/base/base.decorator';
import { PayloadRO } from '~/base/ro/payload.ro';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { CreateNoteDTO } from '~/note/dto/create-note.dto';
import { UpdateNoteDTO } from '~/note/dto/update-note.dto';
import { NoteService } from '~/note/note.service';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllNotes(@Payload() payloadToken: PayloadRO) {
    return await this.noteService.getListNotes(payloadToken);
  }

  // Get note by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getNoteById(
    @Param('id') id: number,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.getNoteById(id, payloadToken);
  }

  // create a new note
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createNote(
    @Body() data: CreateNoteDTO,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.createNote(data, payloadToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateNote(
    @Param('id') id: number,
    @Body() data: UpdateNoteDTO,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.updateNote(id, data, payloadToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('trash/:id')
  async addToTrashNote(
    @Param('id') id: number,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.addToTrashNote(id, payloadToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('untrash/:id')
  async removeFromTrashNote(
    @Param('id') id: number,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.removeFromTrashNote(id, payloadToken);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteNotePermanently(
    @Param('id') id: number,
    @Payload() payloadToken: PayloadRO,
  ) {
    return await this.noteService.deleteNotePermanently(id, payloadToken);
  }
}
