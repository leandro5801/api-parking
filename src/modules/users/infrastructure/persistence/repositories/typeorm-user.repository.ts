import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, PaginationParams } from '../../../../../shared/domain/models/pagination';
import { translateDbError } from '../../../../../shared/infrastructure/persistence/translate-db-error';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) {}

  async save(user: User): Promise<User> {
    try {
      return UserMapper.toDomain(await this.repo.save(UserMapper.toOrm(user)));
    } catch (error) {
      translateDbError(error, 'El email o el documento de identidad ya están registrados');
    }
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ email });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByDocumento(documentoIdentidad: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ documentoIdentidad });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll({ page, limit }: PaginationParams): Promise<Paginated<User>> {
    const [rows, total] = await this.repo.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: rows.map(UserMapper.toDomain), total, page, limit };
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repo.delete({ id });
    } catch (error) {
      translateDbError(error);
    }
  }
}
