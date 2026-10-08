import { User } from '../../domain/model/user.model.js';
import { IUserRepository } from '../../domain/repository/i.repository.user.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    // 1. Buscar el usuario
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Ejecutar la lógica
    user.updateDetails(dto.name, dto.email, dto.telephone);

    // 3. Persistir los cambios
    return await this.userRepository.update(user);
  }
}
