import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Actor } from '../../../../shared/domain/models/actor';
import { BusinessRuleError, NotFoundError } from '../../../../shared/domain/errors/domain-error';
import { RecordActivityUseCase } from '../../../activity-logs/application/use-cases/record-activity.use-case';
import { ActivityAction } from '../../../activity-logs/domain/constants/activity-action';
import { UserRepository } from '../../domain/repositories/user.repository';

export class DeleteUserUseCase implements UseCase<{ id: string; actor: Actor }, void> {
  constructor(
    private readonly users: UserRepository,
    private readonly activity: RecordActivityUseCase,
  ) {}

  async execute({ id, actor }: { id: string; actor: Actor }): Promise<void> {
    if (id === actor.id) throw new BusinessRuleError('No puedes eliminar tu propia cuenta');
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    await this.users.delete(id);
    await this.activity.execute({
      action: ActivityAction.USUARIO_ELIMINADO,
      userId: actor.id,
      details: { targetUserId: id, email: user.email },
    });
  }
}
