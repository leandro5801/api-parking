import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../../../shared/domain/enums/role.enum';

export const PHONE_REGEX = /^[0-9+\-\s()]{6,20}$/;

export class CreateUserDto {
  @ApiProperty({ example: '12345678A', description: 'DNI/Carnet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentoIdentidad: string;

  @ApiProperty({ example: 'Ana Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'ana@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+34 600 123 456' })
  @Matches(PHONE_REGEX, { message: 'telephone no tiene un formato válido' })
  telephone: string;

  @ApiProperty({ minLength: 8, example: 'Str0ngPass!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiProperty({ enum: Role, example: Role.Cliente })
  @IsEnum(Role)
  role: Role;
}
