import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '~/user/user.module';
import { NoteModule } from '~/note/note.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'note-online-secret-key-dc22v7q520',
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
    NoteModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
