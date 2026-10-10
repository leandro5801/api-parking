import { SetMetadata } from '@nestjs/common';
import { Role } from '../../domain/enums/role.enum';

export const ROLES_KEY = 'roles';
/** Roles que pueden acceder a la ruta (patrón RBAC de la documentación oficial de NestJS). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
