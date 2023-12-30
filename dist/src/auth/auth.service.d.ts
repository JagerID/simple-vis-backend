import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'types/types';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly prismaService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, prismaService: PrismaService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    register(registerUserDto: RegisterUserDto): Promise<{
        id: number;
        email: string;
        passwordHash: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginUserDto: LoginUserDto, userAgent: string): Promise<{
        id: number;
        email: string;
        role: string;
        access_token: string;
        refresh_token: RefreshToken;
    }>;
    createRefreshToken(userId: number, userAgent: string): Promise<RefreshToken>;
    deleteRefreshToken(token: string): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        token: string;
        exp: Date;
        userId: number;
        userAgent: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private generateTokens;
    refreshTokens(refreshToken: string, userAgent: string): Promise<{
        id: number;
        email: string;
        role: string;
        access_token: string;
        refresh_token: RefreshToken;
    }>;
}
