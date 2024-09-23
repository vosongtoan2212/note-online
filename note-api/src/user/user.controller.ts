import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '~/guard/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    // Lấy thông tin người dùng từ database
    const user = await this.usersService.findOneById(id);

    // Trả về kết quả
    return user;
  }
}
