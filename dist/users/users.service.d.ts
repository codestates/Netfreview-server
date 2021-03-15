import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/UpdateUserInfoDto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findUserWithUserId(userId: string): Promise<User>;
    findUserWithEmail(email: string): Promise<User>;
    findUserWithNickname(nickname: string): Promise<User>;
    validateCredentials(user: User, password: string): Promise<boolean>;
    findUserWithName(name: string): Promise<User>;
    updateLastLogin(id: string): Promise<void>;
    saveUser(user: User, provider?: string): Promise<User>;
    deleteUser(id: string): Promise<void>;
    updateUserInfo(user: User, dto: UpdateUserInfoDto): Promise<any>;
    generateRandomNickname(): Promise<string>;
}
