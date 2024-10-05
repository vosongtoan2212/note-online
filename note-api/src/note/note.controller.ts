import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { CreateNoteDTO } from '~/note/dto/create-note.dto';
import { UpdateNoteDTO } from '~/note/dto/update-note.dto';
import { NoteService } from '~/note/note.service';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllNotes(@Request() req) {
    return await this.noteService.getListNotes(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trash')
  async getListNotesInTrash(@Request() req) {
    return await this.noteService.getListNotesInTrash(req);
  }

  // Get note by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getNoteById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return await this.noteService.getNoteById(id, req);
  }

  // create a new note
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createNote(@Body() data: CreateNoteDTO, @Request() req) {
    return await this.noteService.createNote(data, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNoteDTO,
    @Request() req,
  ) {
    return await this.noteService.updateNote(id, data, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('trash/:id')
  async addToTrashNote(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return await this.noteService.addToTrashNote(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('untrash/:id')
  async removeFromTrashNote(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.noteService.restoreFromTrash(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteNotePermanently(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.noteService.deleteNotePermanently(id, req);
  }
}
