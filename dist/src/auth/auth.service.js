"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
let AuthService = class AuthService {
    constructor(userService, jwtService, prismaService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.prismaService = prismaService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.BadRequestException('Пользователь не найден');
        const isPasswordMatch = await (0, bcryptjs_1.compare)(password, user.passwordHash);
        if (user && isPasswordMatch) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async register(registerUserDto) {
        return this.userService.create(registerUserDto);
    }
    async login(loginUserDto, userAgent) {
        const user = await this.userService.findByEmail(loginUserDto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Неверный логин или пароль');
        return this.generateTokens(user, userAgent);
    }
    async createRefreshToken(userId, userAgent) {
        const token = await this.prismaService.refreshToken.findFirst({
            where: { userId, userAgent },
        });
        const refreshToken = token ? token?.token : '';
        return this.prismaService.refreshToken.upsert({
            where: { token: refreshToken },
            update: {
                token: (0, uuid_1.v4)(),
                exp: (0, date_fns_1.add)(new Date(), { months: 1 }),
            },
            create: {
                token: (0, uuid_1.v4)(),
                exp: (0, date_fns_1.add)(new Date(), { months: 1 }),
                userId,
                userAgent,
            },
        });
    }
    deleteRefreshToken(token) {
        return this.prismaService.refreshToken.delete({ where: { token } });
    }
    async generateTokens(user, userAgent) {
        const { id, email, role } = user;
        const access_token = this.jwtService.sign({ id, email, role }, { expiresIn: this.configService.get('JWT_ACCESS_EXP') });
        const refresh_token = await this.createRefreshToken(id, userAgent);
        return { id, email, role, access_token, refresh_token };
    }
    async refreshTokens(refreshToken, userAgent) {
        const token = await this.prismaService.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!token)
            throw new common_1.UnauthorizedException();
        await this.prismaService.refreshToken.delete({
            where: { token: refreshToken },
        });
        if (new Date(token.exp) < new Date()) {
            throw new common_1.UnauthorizedException();
        }
        const user = await this.userService.findOne(token.userId);
        return this.generateTokens(user, userAgent);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map