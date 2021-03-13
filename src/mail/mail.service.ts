import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TokenService } from 'src/auth/token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private usersService: UsersService,
    private tokenServcie: TokenService,
  ) {
    this.usersService = usersService;
    this.tokenServcie = tokenServcie;
  }

  public async sendTemporaryPassword(email: string): Promise<void> {
    const user = await this.usersService.findUserWithEmail(email);

    if (!user) {
      throw new UnprocessableEntityException('올바르지 않은 이메일 입니다.');
    }
    const { name } = user;
    const accessToken = await this.tokenServcie.generateTemporaryAccessToken(
      user,
    );

    await this.mailerService.sendMail({
      to: email,
      from: process.env.NODEMAILER_USER,
      subject: `[Netfreview]비밀번호 재설정 링크`,
      html: `<h2>${name}님 비밀번호를 재설정 해주세요.</h2>
            <p>안녕하세요 ${name}님</p>
            <p>아래의 링크를 통해 비밀번호를 재설정하실 수 있습니다.</p>
            <p>이 링크는 3분간 유효합니다.</p>
            <a href='https://netfreview.com/resetpw/${accessToken}'>비밀번호 재설정하기</a>`,
    });
  }
}
