import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Actor } from '../../../../shared/domain/models/actor';
import { ConflictError } from '../../../../shared/domain/errors/domain-error';
import { PasswordHasher } from '../../../../shared/domain/ports/password-hasher';
import { Role } from '../../../../shared/domain/enums/role.enum';
import { RecordActivityUseCase } from '../../../activity-logs/application/use-cases/record-activity.use-case';
import { ActivityAction } from '../../../activity-logs/domain/constants/activity-action';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { toUserResult, UserResult } from '../results/user.result';

export interface CreateUserCommand {
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  password: string;
  role: Role;
  /** Si no hay actor, es un auto-registro. */
  actor?: Actor;
}

export class CreateUserUseCase implements UseCase<CreateUserCommand, UserResult> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly activity: RecordActivityUseCase,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResult> {
    const email = command.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictError('El email ya está registrado');
    }
    if (await this.users.findByDocumento(command.documentoIdentidad)) {
      throw new ConflictError('El documento de identidad ya está registrado');
    }

    const user = await this.users.save(
      User.create({
        documentoIdentidad: command.documentoIdentidad,
        name: command.name,
        email,
        telephone: command.telephone,
        role: command.role,
        passwordHash: await this.hasher.hash(command.password),
      }),
    );

    await this.activity.execute({
      action: command.actor ? ActivityAction.USUARIO_CREADO : ActivityAction.USUARIO_REGISTRADO,
      userId: command.actor?.id ?? user.id,
      details: { targetUserId: user.id, email: user.email, role: user.role },
    });

    return toUserResult(user);
  }
}
