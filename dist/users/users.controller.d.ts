import { TokenService } from 'src/auth/token.service';
import { User } from 'src/entity/User.entity';
import { MailService } from 'src/mail/mail.service';
import { ResponseWithToken } from './interfaces/responseWithToken.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    private tokenService;
    private mailServcie;
    constructor(usersService: UsersService, tokenService: TokenService, mailServcie: MailService);
    signIn(req: any, res: any): Promise<ResponseWithToken>;
    refresh(req: any): Promise<ResponseWithToken>;
    getProfile(req: any): User;
    signOut(req: any, res: any): Promise<string>;
    saveUser(user: User): Promise<string>;
    deleteUser(req: any): Promise<string>;
    updateUserInfo(req: any, payload: any): Promise<string>;
    googleLogin(): void;
    googleLoginCallback(req: any, res: any): Promise<ResponseWithToken>;
    sendTemporaryPassword(body: any): Promise<string>;
}
