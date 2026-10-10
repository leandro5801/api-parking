import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../../../../shared/domain/enums/role.enum';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';

/** Crea el administrador inicial (idempotente) para poder operar la API desde cero. */
@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    private readonly config: ConfigService,
    private readonly users: UserRepository,
    private readonly createUser: CreateUserUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    const email = this.config.get<string>('SEED_ADMIN_EMAIL');
    const password = this.config.get<string>('SEED_ADMIN_PASSWORD');
    if (!email || !password) return;

    try {
      if (await this.users.findByEmail(email.toLowerCase())) return;
      await this.createUser.execute({
        documentoIdentidad: this.config.get<string>('SEED_ADMIN_DOCUMENTO', '00000000'),
        name: 'Administrador',
        email,
        telephone: '000000000',
        password,
        role: Role.Admin,
      });
      this.logger.log(`Administrador inicial creado: ${email}`);
    } catch (error) {
      this.logger.error('No se pudo crear el administrador inicial', (error as Error).stack);
    }
  }
}
