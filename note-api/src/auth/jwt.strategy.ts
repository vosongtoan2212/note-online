import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header Authorization
      ignoreExpiration: false,
      secretOrKey: 'note-online-secret-key-dc22v7q520', // Cần khớp với secret khi tạo token
    });
  }

  async validate(payload: any) {
    // Xác thực payload từ token, trả về đối tượng người dùng
    return { userId: payload.sub, username: payload.username };
  }
}
