import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Actor, isAdmin } from '../../../../shared/domain/models/actor';
import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors/domain-error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { toUserResult, UserResult } from '../results/user.result';

export class GetUserUseCase implements UseCase<{ id: string; actor: Actor }, UserResult> {
  constructor(private readonly users: UserRepository) {}

  async execute({ id, actor }: { id: string; actor: Actor }): Promise<UserResult> {
    if (!isAdmin(actor) && actor.id !== id) {
      throw new ForbiddenError('Solo puedes consultar tu propio perfil');
    }
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return toUserResult(user);
  }
}
