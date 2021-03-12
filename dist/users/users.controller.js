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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const google_auth_guard_1 = require("../auth/guards/google-auth.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const local_auth_guard_1 = require("../auth/guards/local-auth.guard");
const token_service_1 = require("../auth/token.service");
const User_entity_1 = require("../entity/User.entity");
const mail_service_1 = require("../mail/mail.service");
const videos_service_1 = require("../videos/videos.service");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService, tokenService, mailServcie, videosService) {
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.mailServcie = mailServcie;
        this.videosService = videosService;
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.mailServcie = mailServcie;
        this.videosService = videosService;
    }
    async signIn(req, res) {
        const { user } = req;
        await this.usersService.updateLastLogin(user.id);
        const accessToken = await this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, {
            domain: '',
            path: '/',
            secure: true,
            sameSite: 'None',
        });
        return {
            data: { accessToken },
            message: '로그인이 성공적으로 되었습니다.',
        };
    }
    async getReviewKing() {
        const top5UserList = this.usersService.getTope5ReviewKing();
    }
    async refresh(req) {
        console.log(req.cookies);
        const { refreshToken } = req.cookies;
        const { token } = await this.tokenService.createAccessTokenFromRefreshToken(refreshToken);
        return {
            data: { accessToken: token },
            message: 'accessToken이 발급 되었습니다.',
        };
    }
    async getProfile(userId) {
        if (!userId)
            throw new common_1.BadRequestException('보내주신 id값이 잘못되었습니다.');
        const user = await this.usersService.findUserWithUserId(userId);
        if (!user)
            throw new common_1.BadRequestException('해당 유저가 없습니다!');
        const videoList = await this.videosService.getUserVideo(userId);
        return Object.assign(Object.assign(Object.assign({}, user), { videoList }));
    }
    async signOut(req, res) {
        const { user } = req;
        res.clearCookie('refreshToken');
        await this.tokenService.deleteRefreshTokenFromUser(user);
        await this.usersService.updateLastLogin(user.id);
        return '로그아웃 되었습니다.';
    }
    async saveUser(user) {
        await this.usersService.saveUser(user);
        return '회원가입 되었습니다.';
    }
    async deleteUser(req) {
        const { id } = req.user;
        this.usersService.deleteUser(id);
        return '회원탈퇴 되었습니다.';
    }
    async updateUserInfo(req, payload) {
        const { user } = req;
        const userinfo = await this.usersService.updateUserInfo(user, payload);
        return Object.assign({
            user: userinfo,
            message: '회원정보가 수정되었습니다.',
        });
    }
    googleLogin() {
        return;
    }
    async googleLoginCallback(req, res) {
        const { user, tokens: { refreshToken }, } = req.user;
        await this.usersService.updateLastLogin(user.id);
        res.cookie('refreshToken', refreshToken, {
            domain: '',
            path: '/',
            secure: true,
            sameSite: 'None',
        });
        return res.redirect('http://localhost:3000');
    }
    async sendTemporaryPassword(body) {
        const { email } = body;
        await this.mailServcie.sendTemporaryPassword(email);
        return '메일이 전송되었습니다.';
    }
};
__decorate([
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('signin'),
    __param(0, common_1.Request()),
    __param(1, common_1.Response({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signIn", null);
__decorate([
    common_1.Get('reviewKing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getReviewKing", null);
__decorate([
    common_1.Get('refresh'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refresh", null);
__decorate([
    common_1.Get('userinfo/:userId'),
    __param(0, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('signout'),
    __param(0, common_1.Request()),
    __param(1, common_1.Response({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signOut", null);
__decorate([
    common_1.Post('signup'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "saveUser", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserInfo", null);
__decorate([
    common_1.Get('google'),
    common_1.UseGuards(google_auth_guard_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "googleLogin", null);
__decorate([
    common_1.Get('google/redirect'),
    common_1.UseGuards(google_auth_guard_1.GoogleAuthGuard),
    __param(0, common_1.Request()),
    __param(1, common_1.Response({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "googleLoginCallback", null);
__decorate([
    common_1.Post('pw-find'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendTemporaryPassword", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService,
        mail_service_1.MailService,
        videos_service_1.VideosService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map