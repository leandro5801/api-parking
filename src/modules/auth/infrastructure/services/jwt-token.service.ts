import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenClaims, TokenService } from '../../domain/ports/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
  readonly expiresInSeconds: number;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.expiresInSeconds = Number(config.get('JWT_EXPIRES_IN_SECONDS', 3600));
  }

  sign(claims: TokenClaims): Promise<string> {
    return this.jwt.signAsync({ ...claims });
  }
}
