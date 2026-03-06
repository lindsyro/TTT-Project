import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { SignUpRequest } from '../dto/auth/sign-up.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpRequest) {
    const result = await this.authService.register(dto.login, dto.password);

    return result;
  }

  @Get('login')
  async login(@Headers('authorization') authHeader: string) {
    const base64Credentials = authHeader.replace('Basic ', '');
    const userUuid = await this.authService.authorize(base64Credentials);

    return { userId: userUuid };
  }
}
