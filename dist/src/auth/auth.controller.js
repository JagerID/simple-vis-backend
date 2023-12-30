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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const register_user_dto_1 = require("./dto/register-user.dto");
const config_1 = require("@nestjs/config");
const login_user_dto_1 = require("./dto/login-user.dto");
const cookies_decorator_1 = require("../../decorators/cookies.decorator");
const decorators_1 = require("../../decorators");
const prisma_service_1 = require("../prisma.service");
const REFRESH_TOKEN = 'refresh_token';
let AuthController = class AuthController {
    constructor(prismaService, authService, configService) {
        this.prismaService = prismaService;
        this.authService = authService;
        this.configService = configService;
    }
    async register(registerUserDto) {
        return this.authService.register(registerUserDto);
    }
    async login(loginUserDto, res, agent) {
        const loginData = await this.authService.login(loginUserDto, agent);
        if (!loginData)
            throw new common_1.BadRequestException('Ошибка входа');
        const { access_token, email, id, refresh_token, role } = loginData;
        const tokens = { access_token, refresh_token };
        const user = { email, id, role };
        this.setRefreshTokenToCookies(user, tokens, res);
    }
    async logout(refreshToken, res) {
        if (!refreshToken) {
            res.sendStatus(common_1.HttpStatus.OK);
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
        res.sendStatus(common_1.HttpStatus.OK);
    }
    async refresh(cookies, res, agent) {
        const refreshToken = cookies.refresh_token;
        if (!refreshToken)
            throw new common_1.UnauthorizedException();
        const loginData = await this.authService.refreshTokens(cookies.refresh_token, agent);
        if (!loginData)
            throw new common_1.BadRequestException('Ошибка входа');
        const { access_token, email, id, refresh_token, role } = loginData;
        const tokens = { access_token, refresh_token };
        const user = { email, id, role };
        this.setRefreshTokenToCookies(user, tokens, res);
    }
    setRefreshTokenToCookies(user, tokens, res) {
        if (!tokens.refresh_token)
            throw new common_1.UnauthorizedException();
        res.cookie(REFRESH_TOKEN, tokens.refresh_token.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: tokens.refresh_token.exp,
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });
        res
            .status(common_1.HttpStatus.CREATED)
            .json({ user, access_token: tokens.access_token });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, decorators_1.UserAgent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, cookies_decorator_1.Cookies)(REFRESH_TOKEN)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('refresh'),
    __param(0, (0, cookies_decorator_1.Cookies)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, decorators_1.UserAgent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map