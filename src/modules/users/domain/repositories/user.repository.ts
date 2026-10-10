import { Paginated, PaginationParams } from '../../../../shared/domain/models/pagination';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByDocumento(documentoIdentidad: string): Promise<User | null>;
  abstract findAll(params: PaginationParams): Promise<Paginated<User>>;
  abstract delete(id: string): Promise<void>;
}
