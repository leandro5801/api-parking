import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@parking.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin1234!' })
  @IsString()
  @MaxLength(72)
  password: string;
}
