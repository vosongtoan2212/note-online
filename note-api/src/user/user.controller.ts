import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserService) {}
  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    // Lấy thông tin người dùng từ database
    const user = await this.usersService.findOneById(id);

    // Trả về kết quả
    return user;
  }
}
