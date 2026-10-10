import { UseCase } from '../../../../shared/application/use-cases/use-case';
import { Role } from '../../../../shared/domain/enums/role.enum';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { UserResult } from '../../../users/application/results/user.result';

export interface RegisterCommand {
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  password: string;
}

/** Auto-registro público: siempre crea usuarios con rol "cliente" (evita escalada de privilegios). */
export class RegisterUseCase implements UseCase<RegisterCommand, UserResult> {
  constructor(private readonly createUser: CreateUserUseCase) {}

  execute(command: RegisterCommand): Promise<UserResult> {
    return this.createUser.execute({ ...command, role: Role.Cliente });
  }
}
