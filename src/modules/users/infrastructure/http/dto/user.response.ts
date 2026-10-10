import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../../shared/domain/enums/role.enum';

export class UserResponse {
  @ApiProperty() id: string;
  @ApiProperty() documentoIdentidad: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty() telephone: string;
  @ApiProperty({ enum: Role }) role: Role;
}

export class PaginatedUsersResponse {
  @ApiProperty({ type: [UserResponse] }) items: UserResponse[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
}
