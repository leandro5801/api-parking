import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Actor } from '../../../../shared/domain/models/actor';
import { TokenClaims } from '../../domain/ports/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /** Lo devuelto se asigna a request.user y es lo que leen @CurrentUser() y RolesGuard. */
  validate(payload: TokenClaims): Actor {
    return { id: payload.sub, role: payload.role };
  }
}
