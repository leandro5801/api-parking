import { ForbiddenError } from '../errors/domain-error';
import { Role } from '../enums/role.enum';

/** Quien ejecuta un caso de uso (extraído del JWT en la capa HTTP). */
export interface Actor {
  id: string;
  role: Role;
}

export const isAdmin = (actor: Actor): boolean => actor.role === Role.Admin;

export const isStaff = (actor: Actor): boolean =>
  actor.role === Role.Admin || actor.role === Role.Empleado;

/** El personal (admin/empleado) puede operar sobre cualquier recurso; el cliente solo sobre los suyos. */
export function assertOwnerOrStaff(actor: Actor, ownerId: string): void {
  if (!isStaff(actor) && actor.id !== ownerId) {
    throw new ForbiddenError('No tienes permisos sobre este recurso');
  }
}
