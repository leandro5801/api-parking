import { User } from '../model/user.model.js';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<User | null>;
  delete(id: string): Promise<void>;
}
