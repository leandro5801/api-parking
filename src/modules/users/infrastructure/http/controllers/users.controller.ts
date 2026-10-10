import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Actor } from '../../../../../shared/domain/models/actor';
import { Role } from '../../../../../shared/domain/enums/role.enum';
import { CurrentUser } from '../../../../../shared/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../../../shared/infrastructure/decorators/roles.decorator';
import { PaginationQueryDto } from '../../../../../shared/infrastructure/http/pagination-query.dto';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginatedUsersResponse, UserResponse } from '../dto/user.response';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiOkResponse({ type: UserResponse })
  me(@CurrentUser() actor: Actor) {
    return this.getUser.execute({ id: actor.id, actor });
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Listar usuarios (admin)' })
  @ApiOkResponse({ type: PaginatedUsersResponse })
  findAll(@Query() query: PaginationQueryDto) {
    return this.listUsers.execute(query);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear un usuario con cualquier rol (admin)' })
  @ApiCreatedResponse({ type: UserResponse })
  create(@Body() dto: CreateUserDto, @CurrentUser() actor: Actor) {
    return this.createUser.execute({ ...dto, actor });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario (admin o el propio usuario)' })
  @ApiOkResponse({ type: UserResponse })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Actor) {
    return this.getUser.execute({ id, actor });
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar nombre, email, teléfono, etc. de un usuario (admin)' })
  @ApiOkResponse({ type: UserResponse })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: Actor,
  ) {
    return this.updateUser.execute({ ...dto, id, actor });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (admin)' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: Actor) {
    await this.deleteUser.execute({ id, actor });
  }
}
