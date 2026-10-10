import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHasher } from '../../shared/domain/ports/password-hasher';
import { provideUseCase } from '../../shared/infrastructure/nest/provide-use-case';
import { SecurityModule } from '../../shared/infrastructure/security/security.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { RecordActivityUseCase } from '../activity-logs/application/use-cases/record-activity.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { AdminSeeder } from './infrastructure/seeders/admin.seeder';
import { UsersController } from './infrastructure/http/controllers/users.controller';
import { TypeOrmUserRepository } from './infrastructure/persistence/repositories/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), SecurityModule, ActivityLogsModule],
  controllers: [UsersController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    provideUseCase(CreateUserUseCase, [UserRepository, PasswordHasher, RecordActivityUseCase]),
    provideUseCase(GetUserUseCase, [UserRepository]),
    provideUseCase(ListUsersUseCase, [UserRepository]),
    provideUseCase(UpdateUserUseCase, [UserRepository, PasswordHasher, RecordActivityUseCase]),
    provideUseCase(DeleteUserUseCase, [UserRepository, RecordActivityUseCase]),
    AdminSeeder,
  ],
  exports: [UserRepository, CreateUserUseCase, AdminSeeder],
})
export class UsersModule {}
