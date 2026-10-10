import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Actor } from '../../domain/models/actor';

/** Inyecta el usuario autenticado (lo que devuelve JwtStrategy.validate). */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): Actor => {
  return ctx.switchToHttp().getRequest().user;
});
