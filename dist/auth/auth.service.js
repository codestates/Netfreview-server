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
const User_entity_1 = require("../entity/User.entity");
const UserDto_1 = require("../users/dto/UserDto");
const reponseUser_interface_1 = require("../users/interfaces/reponseUser.interface");
const users_service_1 = require("../users/users.service");
const token_service_1 = require("./token.service");
let AuthService = class AuthService {
    constructor(usersService, tokenService) {
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.usersService = usersService;
        this.tokenService = tokenService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findUserWithEmail(email);
        if (!user) {
            throw new common_1.UnprocessableEntityException('이메일이 올바르지 않습니다.');
        }
        const isCorrectPassword = await this.usersService.validateCredentials(user, pass);
        if (!isCorrectPassword) {
            throw new common_1.UnprocessableEntityException('비밀번호가 올바르지 않습니다.');
        }
        delete user.password;
        return user;
    }
    async validateOAuthLogin(userProfile, provider) {
        const { email, name, profileUrl, id } = userProfile;
        let user = await this.usersService.findUserWithEmail(`${email}[AUTH]`);
        if (!user) {
            const newUser = new User_entity_1.User();
            newUser.id = id;
            newUser.email = `${email}[AUTH]`;
            newUser.name = name;
            newUser.profileUrl = profileUrl;
            newUser.nickname = await this.usersService.generateRandomNickname();
            user = await this.usersService.saveUser(newUser, provider);
        }
        const accessToken = await this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user);
        return { user, tokens: { accessToken, refreshToken } };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map