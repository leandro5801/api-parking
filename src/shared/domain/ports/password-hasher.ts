/** Puerto: el dominio/aplicación no conocen bcrypt, argon2, etc. */
export abstract class PasswordHasher {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
