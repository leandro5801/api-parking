import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../domain/errors/domain-error';

const STATUS_BY_CODE: Record<string, HttpStatus> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  BUSINESS_RULE_VIOLATION: HttpStatus.UNPROCESSABLE_ENTITY,
};

/** Traduce errores de dominio a respuestas HTTP coherentes. */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = STATUS_BY_CODE[error.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      error: error.code,
      message: error.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
