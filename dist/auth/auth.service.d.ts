import { UserDto } from 'src/users/dto/UserDto';
import { ResponseUser } from 'src/users/interfaces/reponseUser.interface';
import { UsersService } from 'src/users/users.service';
import { ResponseOAuthLogin } from './interfaces/responseOAuthLogin.interface';
import { TokenService } from './token.service';
export declare class AuthService {
    private usersService;
    private tokenService;
    constructor(usersService: UsersService, tokenService: TokenService);
    validateUser(email: string, pass: string): Promise<ResponseUser>;
    validateOAuthLogin(userProfile: UserDto, provider: string): Promise<ResponseOAuthLogin>;
}
