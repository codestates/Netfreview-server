import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { createRandomString } from 'src/common/utils/string.util';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/UpdateUserInfoDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async findUserWithUserId(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findUserWithEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserWithNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async validateCredentials(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  async findUserWithName(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.findUserWithUserId(id);
    user.lastLogin = new Date();
    await this.userRepository.save(user);
  }

  async saveUser(user: User, provider?: string): Promise<User> {
    const { email, nickname } = user;
    let existingUser = await this.findUserWithEmail(email);

    if (existingUser) {
      throw new UnprocessableEntityException('이미 존재하는 이메일입니다.');
    }
    existingUser = await this.findUserWithNickname(nickname);

    if (existingUser) {
      throw new UnprocessableEntityException('이미 존재하는 닉네임입니다.');
    }

    if (provider) {
      user.password = await hash(Math.random().toString(36), 10);
    } else {
      user.password = await hash(user.password, 10);
    }
    user.lastLogin = new Date();

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async updateUserInfo(user: User, dto: UpdateUserInfoDto): Promise<any> {
    const entries = Object.entries(dto);
    let password;

    for (const entry of entries) {
      const [column, data] = entry;
      if (column === 'password') {
        password = await hash(data, 10);
        user.password = password;
      } else {
        user[column] = data;
      }
    }
    const modifyUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      password,
      profileUrl: user.profileUrl,
      introduction: user.introduction,
      nickname: user.nickname,
    };

    this.userRepository.save(modifyUser);
    delete modifyUser.password;
    return modifyUser;
  }

  async generateRandomNickname(): Promise<string> {
    let nickname = createRandomString(10);
    let isExist = await this.findUserWithNickname(nickname);

    while (isExist) {
      nickname = createRandomString(10);
      isExist = await this.findUserWithNickname(nickname);
    }
    return nickname;
  }
}
