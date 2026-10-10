import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { UnauthorizedError } from '../../../../shared/domain/errors/domain-error';
import { PasswordHasher } from '../../../../shared/domain/ports/password-hasher';
import { RecordActivityUseCase } from '../../../activity-logs/application/use-cases/record-activity.use-case';
import { ActivityAction } from '../../../activity-logs/domain/constants/activity-action';
import { toUserResult, UserResult } from '../../../users/application/results/user.result';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { TokenService } from '../../domain/ports/token.service';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: UserResult;
}

export class LoginUseCase implements UseCase<LoginCommand, AuthResult> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly activity: RecordActivityUseCase,
  ) {}

  async execute({ email, password }: LoginCommand): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.users.findByEmail(normalizedEmail);
    const valid = !!user && (await this.hasher.compare(password, user.passwordHash));

    if (!user || !valid) {
      await this.activity.execute({
        action: ActivityAction.LOGIN_FALLIDO,
        userId: user?.id ?? 'anonymous',
        details: { email: normalizedEmail },
      });
      // Mensaje genérico: no revela si el email existe.
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const accessToken = await this.tokens.sign({ sub: user.id, role: user.role });
    await this.activity.execute({
      action: ActivityAction.LOGIN_EXITOSO,
      userId: user.id,
      details: { email: user.email },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.tokens.expiresInSeconds,
      user: toUserResult(user),
    };
  }
}
