import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { TokenService } from 'src/auth/token.service';
import { User } from 'src/entity/User.entity';
import { MailService } from 'src/mail/mail.service';
import { VideosService } from 'src/videos/videos.service';
import { ResponseWithToken } from './interfaces/responseWithToken.interface';
import { UsersService } from './users.service';
import { ResponseWithTokenSignin } from './interfaces/responseWithTokenSignin.interface';
import { UpdateUserInfoDto } from './dto/UpdateUserInfoDto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private mailServcie: MailService,
    private videosService: VideosService,
  ) {
    this.usersService = usersService;
    this.tokenService = tokenService;
    this.mailServcie = mailServcie;
    this.videosService = videosService;
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<ResponseWithTokenSignin> {
    const { user } = req;
    await this.usersService.updateLastLogin(user.id);
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      domain: '',
      path: '/',
      secure: true,
      // httpOnly: true,
      sameSite: 'None',
    });

    return {
      data: { accessToken },
      user,
      message: '로그인이 성공적으로 되었습니다.',
    };
  }

  @Get('reviewKing')
  async getReviewKing(): Promise<any> {
    const top5UserList = this.usersService.getTope5ReviewKing();
  }

  @Get('refresh')
  async refresh(@Request() req: any): Promise<ResponseWithToken> {
    console.log(req.cookies);
    const { refreshToken } = req.cookies;
    const { token } = await this.tokenService.createAccessTokenFromRefreshToken(
      refreshToken,
    );

    return {
      data: { accessToken: token },
      message: 'accessToken이 발급 되었습니다.',
    };
  }

  @Get('userinfo')
  async getProfile(@Query('userId') userId: string): Promise<any> {
    if (!userId)
      throw new BadRequestException('보내주신 id값이 잘못되었습니다.');

    const user = await this.usersService.findUserWithUserId(userId);

    if (!user) throw new BadRequestException('해당 유저가 없습니다!');

    const videoList = await this.videosService.getUserVideo(userId);
    delete user.password;
    return Object.assign({
      ...user,
      videoList,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<string> {
    const { user } = req;
    res.clearCookie('refreshToken');
    await this.tokenService.deleteRefreshTokenFromUser(user);
    await this.usersService.updateLastLogin(user.id);
    return '로그아웃 되었습니다.';
  }

  @Post('signup')
  async saveUser(@Body() user: User): Promise<string> {
    await this.usersService.saveUser(user);

    return '회원가입 되었습니다.';
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Request() req): Promise<string> {
    const { id } = req.user;
    this.usersService.deleteUser(id);
    return '회원탈퇴 되었습니다.';
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUserInfo(@Request() req, @Body() payload): Promise<string> {
    const { user } = req;
    const userinfo = await this.usersService.updateUserInfo(user, payload);
    return Object.assign({
      user: userinfo,
      message: '회원정보가 수정되었습니다.',
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<ResponseWithToken> {
    const {
      user,
      tokens: { refreshToken },
    } = req.user;
    await this.usersService.updateLastLogin(user.id);

    res.cookie('refreshToken', refreshToken, {
      domain: '',
      path: '/',
      secure: true,
      // httpOnly: true,
      sameSite: 'None',
    });
    return res.redirect('http://localhost:3000'); // 배포후에는 https://netfreview.com
  }

  @Post('pw-find')
  async sendTemporaryPassword(@Body() body): Promise<string> {
    const { email } = body;
    await this.mailServcie.sendTemporaryPassword(email);
    return '메일이 전송되었습니다.';
  }
}
