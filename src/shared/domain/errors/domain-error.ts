/**
 * Errores de dominio: independientes de HTTP y de NestJS.
 * La capa de infraestructura (DomainExceptionFilter) los traduce a códigos HTTP.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
}

export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
}

/** Violación de una regla de negocio (p. ej. fechas incoherentes, transición de estado inválida). */
export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';
}
