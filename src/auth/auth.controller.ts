import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken, User } from 'types/types';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { Cookies } from 'decorators/cookies.decorator';
import { UserAgent } from 'decorators';
import { PrismaService } from 'src/prisma.service';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const loginData = await this.authService.login(loginUserDto, agent);
    if (!loginData) throw new BadRequestException('Ошибка входа');

    const { access_token, email, id, refresh_token, role } = loginData;
    const tokens = { access_token, refresh_token };
    const user = { email, id, role };

    this.setRefreshTokenToCookies(user, tokens, res);
  }

  @Get('logout')
  async logout(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    const isTokenExist = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (isTokenExist) {
      await this.authService.deleteRefreshToken(refreshToken);
    }
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh')
  async refresh(
    @Cookies() cookies: { refresh_token: string },
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const refreshToken = cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();

    const loginData = await this.authService.refreshTokens(
      cookies.refresh_token,
      agent,
    );
    if (!loginData) throw new BadRequestException('Ошибка входа');

    const { access_token, email, id, refresh_token, role } = loginData;
    const tokens = { access_token, refresh_token };
    const user = { email, id, role };

    this.setRefreshTokenToCookies(user, tokens, res);
  }

  private setRefreshTokenToCookies(
    user: User,
    tokens: { access_token: string; refresh_token: RefreshToken },
    res: Response,
  ) {
    if (!tokens.refresh_token) throw new UnauthorizedException();

    res.cookie(REFRESH_TOKEN, tokens.refresh_token.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: tokens.refresh_token.exp,
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });

    res
      .status(HttpStatus.CREATED)
      .json({ user, access_token: tokens.access_token });
  }
}
