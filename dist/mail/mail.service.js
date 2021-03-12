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
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const token_service_1 = require("../auth/token.service");
const users_service_1 = require("../users/users.service");
let MailService = class MailService {
    constructor(mailerService, usersService, tokenServcie) {
        this.mailerService = mailerService;
        this.usersService = usersService;
        this.tokenServcie = tokenServcie;
        this.usersService = usersService;
        this.tokenServcie = tokenServcie;
    }
    async sendTemporaryPassword(email) {
        const user = await this.usersService.findUserWithEmail(email);
        if (!user) {
            throw new common_1.UnprocessableEntityException('올바르지 않은 이메일 입니다.');
        }
        const { name } = user;
        const accessToken = await this.tokenServcie.generateTemporaryAccessToken(user);
        await this.mailerService.sendMail({
            to: email,
            from: process.env.NODEMAILER_USER,
            subject: `[Netfreview]비밀번호 재설정 링크`,
            html: `<h2>${name}님 비밀번호를 재설정 해주세요.</h2>
            <p>안녕하세요 ${name}님</p>
            <p>아래의 링크를 통해 비밀번호를 재설정하실 수 있습니다.</p>
            <p>이 링크는 3분간 유효합니다.</p>
            <a href='https://netfreview/resetpw/${accessToken}'>비밀번호 재설정하기</a>`,
        });
    }
};
MailService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        users_service_1.UsersService,
        token_service_1.TokenService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map