import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordHasher } from '../../shared/domain/ports/password-hasher';
import { JwtAuthGuard } from '../../shared/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/infrastructure/guards/roles.guard';
import { provideUseCase } from '../../shared/infrastructure/nest/provide-use-case';
import { SecurityModule } from '../../shared/infrastructure/security/security.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { RecordActivityUseCase } from '../activity-logs/application/use-cases/record-activity.use-case';
import { CreateUserUseCase } from '../users/application/use-cases/create-user.use-case';
import { UserRepository } from '../users/domain/repositories/user.repository';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { TokenService } from './domain/ports/token.service';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: Number(config.get('JWT_EXPIRES_IN_SECONDS', 3600)) },
      }),
    }),
    UsersModule,
    SecurityModule,
    ActivityLogsModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    { provide: TokenService, useClass: JwtTokenService },
    provideUseCase(LoginUseCase, [
      UserRepository,
      PasswordHasher,
      TokenService,
      RecordActivityUseCase,
    ]),
    provideUseCase(RegisterUseCase, [CreateUserUseCase]),
    // Orden importa: primero autenticación, después autorización por roles.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
