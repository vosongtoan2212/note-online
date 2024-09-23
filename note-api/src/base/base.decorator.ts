import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Payload = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const token = request.headers.authorization.replace('Bearer ', '');
      const decoded = jwt.decode(token);
      return decoded ? decoded : {};
    }
    return {};
  },
);
