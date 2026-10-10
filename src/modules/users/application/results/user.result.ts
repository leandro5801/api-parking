import { Role } from '../../../../shared/domain/enums/role.enum';
import { User } from '../../domain/entities/user.entity';

/** Vista de salida del caso de uso: nunca expone el hash de la contraseña. */
export interface UserResult {
  id: string;
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  role: Role;
}

export const toUserResult = (user: User): UserResult => ({
  id: user.id,
  documentoIdentidad: user.documentoIdentidad,
  name: user.name,
  email: user.email,
  telephone: user.telephone,
  role: user.role,
});
