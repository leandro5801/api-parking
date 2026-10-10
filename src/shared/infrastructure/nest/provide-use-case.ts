import { InjectionToken, Provider } from '@nestjs/common';

type Constructor<T> = new (...args: any[]) => T;

/**
 * Registra un caso de uso SIN decorarlo con @Injectable():
 * la capa de aplicación permanece libre de dependencias de NestJS.
 * Las dependencias se resuelven por token (puertos abstractos del dominio).
 */
export function provideUseCase<T>(useCase: Constructor<T>, deps: InjectionToken[] = []): Provider {
  return {
    provide: useCase,
    useFactory: (...args: unknown[]) => new useCase(...args),
    inject: deps,
  };
}
