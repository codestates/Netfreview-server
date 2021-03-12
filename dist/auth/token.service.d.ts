import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/entity/RefreshToken.entity';
import { User } from 'src/entity/User.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshTokenPayload } from './interfaces/refreshTokenPayload.interface';
export declare class TokenService {
    private jwtService;
    private usersService;
    private refreshRepository;
    constructor(jwtService: JwtService, usersService: UsersService, refreshRepository: Repository<RefreshToken>);
    findTokenById(id: string): Promise<RefreshToken | null>;
    createRefreshToken(user: User): Promise<RefreshToken>;
    generateAccessToken(user: User): Promise<string>;
    generateTemporaryAccessToken(user: User): Promise<string>;
    resolveAccessToken(encoded: string): Promise<any>;
    generateRefreshToken(user: User): Promise<string>;
    resolveRefreshToken(encoded: string): Promise<{
        user: User;
        token: RefreshToken;
    }>;
    createAccessTokenFromRefreshToken(refresh: string): Promise<{
        token: string;
        user: User;
    }>;
    decodeRefreshToken(token: string): Promise<RefreshTokenPayload>;
    getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<User>;
    getStoredTokenFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<RefreshToken>;
    deleteRefreshTokenFromUser(user: User): Promise<void>;
}
