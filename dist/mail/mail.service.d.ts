import { MailerService } from '@nestjs-modules/mailer';
import { TokenService } from 'src/auth/token.service';
import { UsersService } from 'src/users/users.service';
export declare class MailService {
    private readonly mailerService;
    private usersService;
    private tokenServcie;
    constructor(mailerService: MailerService, usersService: UsersService, tokenServcie: TokenService);
    sendTemporaryPassword(email: string): Promise<void>;
}
