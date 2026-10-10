import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../../../../shared/infrastructure/decorators/public.decorator';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../../application/use-cases/register.use-case';
import { UserResponse } from '../../../../users/infrastructure/http/dto/user.response';
import { AuthResponse } from '../dto/auth.response';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly register: RegisterUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro público (crea un usuario con rol cliente)' })
  @ApiCreatedResponse({ type: UserResponse })
  signUp(@Body() dto: RegisterDto) {
    return this.register.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener un JWT' })
  @ApiOkResponse({ type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  signIn(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }
}
