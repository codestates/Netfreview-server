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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const RefreshToken_entity_1 = require("../entity/RefreshToken.entity");
const User_entity_1 = require("../entity/User.entity");
const users_service_1 = require("../users/users.service");
const typeorm_2 = require("typeorm");
let TokenService = class TokenService {
    constructor(jwtService, usersService, refreshRepository) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.refreshRepository = refreshRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async findTokenById(id) {
        return this.refreshRepository.findOne({ where: { id } });
    }
    async createRefreshToken(user) {
        const refreshToken = new RefreshToken_entity_1.RefreshToken();
        refreshToken.user = user;
        const existedToken = await this.refreshRepository
            .createQueryBuilder('refreshToken')
            .leftJoinAndSelect('refreshToken.user', 'user')
            .where('user.id = :id', { id: user.id })
            .getOne();
        if (existedToken) {
            await this.refreshRepository
                .createQueryBuilder('refreshToken')
                .delete()
                .where('id = :id', { id: existedToken.id })
                .execute();
        }
        await this.refreshRepository.save(refreshToken);
        return refreshToken;
    }
    async generateAccessToken(user) {
        const payload = { email: user.email, sub: user.id };
        const opts = {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '2h',
        };
        return this.jwtService.sign(payload, opts);
    }
    async generateTemporaryAccessToken(user) {
        const payload = { email: user.email, sub: user.id };
        const opts = {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '3m',
        };
        return this.jwtService.sign(payload, opts);
    }
    async resolveAccessToken(encoded) {
        try {
            return this.jwtService.verify(encoded, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
        }
        catch (e) {
            return null;
        }
    }
    async generateRefreshToken(user) {
        const token = await this.createRefreshToken(user);
        const payload = { email: user.email, sub: user.id };
        const opts = {
            jwtid: String(token.id),
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '30d',
        };
        return this.jwtService.sign(payload, opts);
    }
    async resolveRefreshToken(encoded) {
        const payload = await this.decodeRefreshToken(encoded);
        const token = await this.getStoredTokenFromRefreshTokenPayload(payload);
        if (!token) {
            throw new common_1.UnprocessableEntityException('토큰이 존재하지 않습니다.');
        }
        const user = await this.getUserFromRefreshTokenPayload(payload);
        if (!user) {
            throw new common_1.UnprocessableEntityException('유효하지 않은 토큰입니다.');
        }
        return { user, token };
    }
    async createAccessTokenFromRefreshToken(refresh) {
        const { user } = await this.resolveRefreshToken(refresh);
        const token = await this.generateAccessToken(user);
        return { user, token };
    }
    async decodeRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            });
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnprocessableEntityException('Refresh token expired');
            }
            else {
                throw new common_1.UnprocessableEntityException('유효하지 않은 토큰입니다.');
            }
        }
    }
    async getUserFromRefreshTokenPayload(payload) {
        const subId = payload.sub;
        if (!subId) {
            throw new common_1.UnprocessableEntityException('유효하지 않은 토큰입니다.');
        }
        return this.usersService.findUserWithUserId(subId);
    }
    async getStoredTokenFromRefreshTokenPayload(payload) {
        const tokenId = payload.jti;
        if (!tokenId) {
            throw new common_1.UnprocessableEntityException('Refresh token malformed');
        }
        return this.findTokenById(tokenId);
    }
    async deleteRefreshTokenFromUser(user) {
        await this.refreshRepository
            .createQueryBuilder('refreshToken')
            .leftJoinAndSelect('refreshToken.user', 'user')
            .delete()
            .where('user.id = :id', { id: user.id })
            .execute();
    }
};
TokenService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(RefreshToken_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        typeorm_2.Repository])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map