import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Actor } from '../../../../shared/domain/models/actor';
import { ConflictError, NotFoundError } from '../../../../shared/domain/errors/domain-error';
import { PasswordHasher } from '../../../../shared/domain/ports/password-hasher';
import { Role } from '../../../../shared/domain/enums/role.enum';
import { RecordActivityUseCase } from '../../../activity-logs/application/use-cases/record-activity.use-case';
import { ActivityAction } from '../../../activity-logs/domain/constants/activity-action';
import { UserRepository } from '../../domain/repositories/user.repository';
import { toUserResult, UserResult } from '../results/user.result';

export interface UpdateUserCommand {
  id: string;
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  role?: Role;
  password?: string;
  actor: Actor;
}

export class UpdateUserUseCase implements UseCase<UpdateUserCommand, UserResult> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly activity: RecordActivityUseCase,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResult> {
    const user = await this.users.findById(command.id);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const email = command.email.trim().toLowerCase();
    const sameEmail = await this.users.findByEmail(email);
    if (sameEmail && sameEmail.id !== user.id) throw new ConflictError('El email ya está en uso');
    const sameDoc = await this.users.findByDocumento(command.documentoIdentidad);
    if (sameDoc && sameDoc.id !== user.id) {
      throw new ConflictError('El documento de identidad ya está en uso');
    }

    const changedFields = user.updateDetails({
      documentoIdentidad: command.documentoIdentidad,
      name: command.name,
      email,
      telephone: command.telephone,
      role: command.role ?? user.role,
    });
    if (command.password) {
      user.changePassword(await this.hasher.hash(command.password));
      changedFields.push('password');
    }

    const saved = await this.users.save(user);
    await this.activity.execute({
      action: ActivityAction.USUARIO_ACTUALIZADO,
      userId: command.actor.id,
      details: { targetUserId: saved.id, changedFields },
    });
    return toUserResult(saved);
  }
}
