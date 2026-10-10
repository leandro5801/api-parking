import { QueryFailedError } from 'typeorm';
import { ConflictError } from '../../domain/errors/domain-error';

/** Traduce errores de PostgreSQL a errores de dominio, para que ninguna capa superior conozca el motor. */
export function translateDbError(error: unknown, uniqueMessage = 'El recurso ya existe'): never {
  if (error instanceof QueryFailedError) {
    const code = (error as QueryFailedError & { driverError?: { code?: string } }).driverError
      ?.code;
    if (code === '23505') throw new ConflictError(uniqueMessage); // unique_violation
    if (code === '23503') {
      // foreign_key_violation
      throw new ConflictError(
        'El recurso tiene registros asociados o referencia a uno inexistente',
      );
    }
    if (code === '23P01') {
      // exclusion_violation
      throw new ConflictError('La plaza o el vehículo ya tiene una reserva activa en ese horario');
    }
  }
  throw error;
}
