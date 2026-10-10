import { Module } from '@nestjs/common';
import { PasswordHasher } from '../../domain/ports/password-hasher';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';

@Module({
  providers: [{ provide: PasswordHasher, useClass: BcryptPasswordHasher }],
  exports: [PasswordHasher],
})
export class SecurityModule {}
