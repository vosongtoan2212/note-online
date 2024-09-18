import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '~/entities/user.entity';
import { UserRepository } from './user.repository';
import { RegisterDTO } from '~/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async checkEmailExited(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    return !!user;
  }

  async register(registerDto: RegisterDTO): Promise<UserEntity> {
    const { email, password, fullname } = registerDto;

    // Kiểm tra xem người dùng có tồn tại chưa
    const userExists = await this.checkEmailExited(email);
    if (userExists) {
      throw new ConflictException('Email has been registered');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo đối tượng UserEntity mới
    const newUser = this.userRepository.create({
      password: hashedPassword,
      email,
      fullname,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(newUser);

    // Lưu người dùng vào cơ sở dữ liệu
    return newUser;
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
