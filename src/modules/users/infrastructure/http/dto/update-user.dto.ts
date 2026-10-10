import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../../../shared/domain/enums/role.enum';
import { PHONE_REGEX } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ example: '12345678A' })
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

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ minLength: 8, description: 'Solo si se desea cambiar la contraseña' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;
}
