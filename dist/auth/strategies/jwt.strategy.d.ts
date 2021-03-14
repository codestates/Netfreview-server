import { Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/dto/UserDto';
import { UsersService } from 'src/users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<UserDto | null>;
}
export {};
