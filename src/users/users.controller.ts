import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
  ): Promise<ResponseWithToken> {
    const { user } = req;
    await this.usersService.updateLastLogin(user.id);
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      domain: 'netfreview.com',
      path: '/',
      secure: true,
      httpsOnly: true,
      sameSite: 'None',
    });

    return {
      data: { accessToken },
      message: '로그인이 성공적으로 되었습니다.',
    };
  }

  @Get('userinfo/:userId')
  async getUser(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId 값을 주세요');
    const user = await this.usersService.findUserWithUserId(userId);
    if (!user) throw new BadRequestException('유효하지 않은 유저입니다.');
    const rawVideoList = await this.videosService.getUserVideoWithReview(
      userId,
    );
    delete user.password;
    delete user.email;
    const videoList = [];
    for (const video of rawVideoList) {
      const newVideo = {
        id: video.video_id,
        title: video.video_title,
        description: video.video_description,
        director: video.video_director,
        actor: video.video_actor,
        ageLimit: video.video_ageLimit,
        releaseYear: video.video_releaseYer,
        posterUrl: video.video_posterUrl,
        bannerUrl: video.video_bannerUrl,
        netflixUrl: video.video_netflixUrl,
        type: video.video_type,
        createdAt: video.video_createdAt,
        updatedAt: video.video_updatedAt,
        rating: video.avg,
      };
      videoList.push(newVideo);
    }

    return Object.assign({
      ...user,
      videoList,
    });
  }

  @Get('refresh')
  async refresh(@Request() req: any): Promise<ResponseWithToken> {
    const { refreshToken } = req.cookies;
    const { token } = await this.tokenService.createAccessTokenFromRefreshToken(
      refreshToken,
    );

    return {
      data: { accessToken: token },
      message: 'accessToken이 발급 되었습니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('myinfo')
  async getProfile(@Req() req: any): Promise<any> {
    const user = req.user;
    if (!user) throw new BadRequestException('해당 유저가 없습니다!');
    return user;
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
    if (payload.nickname && payload.nickname !== user.nickname) {
      const isUser = await this.usersService.findUserWithNickname(
        payload.nickname,
      );
      if (isUser) throw new ConflictException('닉네임이 중복됩니다.');
    }
    const userinfo = await this.usersService.updateUserInfo(user, payload);
    delete userinfo.email;
    delete userinfo.password;
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
      tokens: { accessToken, refreshToken },
    } = req.user;
    await this.usersService.updateLastLogin(user.id);
    res.cookie('refreshToken', refreshToken, {
      domain: 'netfreview.com',
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'None',
    });
    return res.redirect(
      `https://www.netfreview.com/oauth/?token=${accessToken}`,
    );
  }

  @Post('pw-find')
  async sendTemporaryPassword(@Body() body): Promise<string> {
    const { email } = body;
    await this.mailServcie.sendTemporaryPassword(email);
    return '메일이 전송되었습니다.';
  }
}
