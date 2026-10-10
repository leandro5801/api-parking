import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../../../../users/infrastructure/http/dto/create-user.dto';

/** Igual que CreateUserDto pero sin "role": el rol lo fija el servidor. */
export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}
