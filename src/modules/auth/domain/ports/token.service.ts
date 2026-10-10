import { Role } from '../../../../shared/domain/enums/role.enum';

export interface TokenClaims {
  sub: string;
  role: Role;
}

/** Puerto: la aplicación no sabe si los tokens son JWT, PASETO, etc. */
export abstract class TokenService {
  abstract sign(claims: TokenClaims): Promise<string>;
  abstract readonly expiresInSeconds: number;
}
