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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt_1 = require("bcrypt");
const string_util_1 = require("../common/utils/string.util");
const User_entity_1 = require("../entity/User.entity");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.userRepository = userRepository;
    }
    async findUserWithUserId(userId) {
        return await this.userRepository.findOne({ where: { id: userId } });
    }
    async findUserWithEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findUserWithNickname(nickname) {
        return await this.userRepository.findOne({ where: { nickname } });
    }
    async validateCredentials(user, password) {
        return bcrypt_1.compare(password, user.password);
    }
    async findUserWithName(name) {
        return await this.userRepository.findOne({ where: { name } });
    }
    async updateLastLogin(id) {
        const user = await this.findUserWithUserId(id);
        user.lastLogin = new Date();
        await this.userRepository.save(user);
    }
    async saveUser(user, provider) {
        const { email, nickname } = user;
        let existingUser = await this.findUserWithEmail(email);
        if (existingUser) {
            throw new common_1.UnprocessableEntityException('이미 존재하는 이메일입니다.');
        }
        existingUser = await this.findUserWithNickname(nickname);
        if (existingUser) {
            throw new common_1.UnprocessableEntityException('이미 존재하는 닉네임입니다.');
        }
        if (provider) {
            user.password = await bcrypt_1.hash(Math.random().toString(36), 10);
        }
        else {
            user.password = await bcrypt_1.hash(user.password, 10);
        }
        user.lastLogin = new Date();
        return await this.userRepository.save(user);
    }
    async deleteUser(id) {
        await this.userRepository.delete({ id });
    }
    async updateUserInfo(user, dto) {
        const entries = Object.entries(dto);
        console.log(entries);
        for (const entry of entries) {
            console.log(entry[0]);
            this.userRepository
                .createQueryBuilder('user')
                .update()
                .set({})
                .where('id = :id', { id: user.id })
                .execute();
        }
        return await this.userRepository.findOne({ id: user.id });
    }
    async generateRandomNickname() {
        let nickname = string_util_1.createRandomString(10);
        let isExist = await this.findUserWithNickname(nickname);
        while (isExist) {
            nickname = string_util_1.createRandomString(10);
            isExist = await this.findUserWithNickname(nickname);
        }
        return nickname;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map