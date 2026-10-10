import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Paginated, PaginationParams } from '../../../../shared/domain/models/pagination';
import { UserRepository } from '../../domain/repositories/user.repository';
import { toUserResult, UserResult } from '../results/user.result';

export class ListUsersUseCase implements UseCase<PaginationParams, Paginated<UserResult>> {
  constructor(private readonly users: UserRepository) {}

  async execute(params: PaginationParams): Promise<Paginated<UserResult>> {
    const page = await this.users.findAll(params);
    return { ...page, items: page.items.map(toUserResult) };
  }
}
