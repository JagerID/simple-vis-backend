import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User } from 'types/types';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Пользователь не найден');
    const isPasswordMatch = await compare(password, user.passwordHash);

    if (user && isPasswordMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerUserDto: RegisterUserDto) {
    return this.userService.create(registerUserDto);
  }

  async login(loginUserDto: LoginUserDto, userAgent: string) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');
    return this.generateTokens(user, userAgent);
  }

  async createRefreshToken(
    userId: number,
    userAgent: string,
  ): Promise<RefreshToken> {
    const token = await this.prismaService.refreshToken.findFirst({
      where: { userId, userAgent },
    });

    const refreshToken = token ? token?.token : '';

    return this.prismaService.refreshToken.upsert({
      where: { token: refreshToken },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent,
      },
    });
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.refreshToken.delete({ where: { token } });
  }

  private async generateTokens(user: User, userAgent: string) {
    const { id, email, role } = user;

    const access_token = this.jwtService.sign(
      { id, email, role },
      { expiresIn: this.configService.get('JWT_ACCESS_EXP') },
    );

    const refresh_token = await this.createRefreshToken(id, userAgent);
    return { id, email, role, access_token, refresh_token };
  }

  async refreshTokens(refreshToken: string, userAgent: string) {
    const token = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!token) throw new UnauthorizedException();

    await this.prismaService.refreshToken.delete({
      where: { token: refreshToken },
    });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);

    return this.generateTokens(user, userAgent);
  }
}
