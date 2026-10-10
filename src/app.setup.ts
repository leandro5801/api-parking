import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';

/** Configuración compartida entre main.ts y los tests e2e (misma app en ambos). */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
}
