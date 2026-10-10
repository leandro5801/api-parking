import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../../../../users/infrastructure/http/dto/user.response';

export class AuthResponse {
  @ApiProperty() accessToken: string;
  @ApiProperty({ example: 'Bearer' }) tokenType: string;
  @ApiProperty({ example: 3600, description: 'Segundos hasta la expiración' }) expiresIn: number;
  @ApiProperty({ type: UserResponse }) user: UserResponse;
}
