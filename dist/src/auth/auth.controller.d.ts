import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma.service';
export declare class AuthController {
    private readonly prismaService;
    private readonly authService;
    private readonly configService;
    constructor(prismaService: PrismaService, authService: AuthService, configService: ConfigService);
    register(registerUserDto: RegisterUserDto): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginUserDto: LoginUserDto, res: Response, agent: string): Promise<void>;
    logout(refreshToken: string, res: Response): Promise<void>;
    refresh(cookies: {
        refresh_token: string;
    }, res: Response, agent: string): Promise<void>;
    private setRefreshTokenToCookies;
}
